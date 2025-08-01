import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Trash2, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { getUsers } from '@/api/apiUsers'
import { useCallback, useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'
import { formatErrorMessage } from '@/utils/format'
import type { AlunoType, ProjetoType, UserType } from '@/utils/types'
import {
  deleteProjetoParticipante,
  getProjetoById,
  postProjetoParticipante,
} from '@/api/apiProjeto'
import { getAlunos } from '@/api/apiAlunos'

interface VincularAlunoDialogProps {
  isOpen: boolean
  onClose: () => void
  projeto: ProjetoType | null
  onUpdateProjeto: () => void
}

export const VincularAlunoDialog = ({
  isOpen,
  onClose,
  projeto,
  onUpdateProjeto,
}: VincularAlunoDialogProps) => {
  const [alunos, setAlunos] = useState<AlunoType[]>([])
  const [users, setUsers] = useState<UserType[]>([])
  const [projetoData, setProjetoData] = useState<ProjetoType>()
  const [selectedParticipante, setSelectedParticipante] = useState('')
  const [selectedTipo, setSelectedTipo] = useState<'ALUNO' | 'SERVIDOR'>(
    'ALUNO'
  )
  const [funcao, setFuncao] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const participantesPorPagina = 5

  const fetchAlunos = async () => {
    try {
      const data = await getAlunos()
      setAlunos(data)
    } catch (error) {
      toast.error(formatErrorMessage(error, 'Erro ao carregar alunos.'))
    }
  }

  const fetchUsers = async () => {
    try {
      const data = await getUsers()
      setUsers(data)
    } catch (error) {
      toast.error(formatErrorMessage(error, 'Erro ao carregar servidores.'))
    }
  }

  const fetchProjetoById = useCallback(async () => {
    if (!projeto) return
    try {
      const data = await getProjetoById(projeto.id)
      setProjetoData(data)
    } catch (error) {
      toast.error(formatErrorMessage(error, 'Erro ao carregar projeto.'))
    }
  }, [projeto])

  useEffect(() => {
    if (isOpen) {
      fetchAlunos()
      fetchUsers()
      if (projeto) {
        fetchProjetoById()
      }
    }
  }, [isOpen, projeto, fetchProjetoById])

  const handleAddParticipante = async () => {
    if (!projeto || !selectedParticipante || !funcao) {
      return toast.error('Preencha todos os campos obrigatórios')
    }

    try {
      await postProjetoParticipante(
        projeto.id,
        selectedParticipante,
        selectedTipo,
        funcao
      )
      toast.success('Participante vinculado com sucesso!')
      onUpdateProjeto()
      await fetchProjetoById()
      setSelectedParticipante('')
      setFuncao('')
    } catch (error) {
      toast.error(formatErrorMessage(error, 'Erro ao vincular participante'))
    }
  }

  const handleRemoveParticipante = async (participanteId: string) => {
    if (!projeto) return

    const confirm = window.confirm(
      'Tem certeza que deseja remover este participante?'
    )
    if (!confirm) return

    try {
      await deleteProjetoParticipante(projeto.id, participanteId)
      toast.success('Participante removido do projeto!')
      onUpdateProjeto()
      await fetchProjetoById()
    } catch (error) {
      toast.error(formatErrorMessage(error, 'Erro ao remover participante'))
    }
  }

  const participantes = projetoData?.participantes ?? []
  const startIndex = currentPage * participantesPorPagina
  const endIndex = startIndex + participantesPorPagina
  const participantesPaginados = participantes.slice(startIndex, endIndex)
  const totalPaginas = Math.ceil(participantes.length / participantesPorPagina)

  const alunosDisponiveis = alunos.filter(
    (aluno) => !participantes.some((p) => p.alunoId === aluno.id)
  )

  const usersDisponiveis = users.filter(
    (user) => !participantes.some((p) => p.userId === user.id)
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl md:max-w-4xl px-4 py-6">
        <DialogHeader className="space-y-1.5">
          <DialogTitle className="">
            Participantes do Projeto:{' '}
            <span className="text-primary font-bold italic">
              {projeto?.titulo}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Tipo*</label>
              <Select
                value={selectedTipo}
                onValueChange={(value: 'ALUNO' | 'SERVIDOR') => {
                  setSelectedTipo(value)
                  setSelectedParticipante('')
                }}
              >
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALUNO">Aluno</SelectItem>
                  <SelectItem value="SERVIDOR">Servidor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">
                {selectedTipo === 'ALUNO' ? 'Aluno*' : 'Servidor*'}
              </label>
              <Select
                value={selectedParticipante}
                onValueChange={setSelectedParticipante}
              >
                <SelectTrigger className="h-9 w-full">
                  <SelectValue
                    placeholder={`Selecione um ${selectedTipo.toLowerCase()}`}
                  />
                </SelectTrigger>
                <SelectContent>
                  {selectedTipo === 'ALUNO' ? (
                    alunosDisponiveis.length > 0 ? (
                      alunosDisponiveis.map((aluno) => (
                        <SelectItem key={aluno.id} value={aluno.id}>
                          {aluno.nome} - {aluno.turma}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-muted-foreground">
                        Nenhum aluno disponível
                      </div>
                    )
                  ) : usersDisponiveis.length > 0 ? (
                    usersDisponiveis.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.nome} - {user.email}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-sm text-muted-foreground">
                      Nenhum servidor disponível
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            <div className="space-y-1">
              <label className="text-sm font-medium">Função*</label>
              <Input
                placeholder="Ex: Pesquisador, Orientador, etc."
                value={funcao}
                onChange={(e) => setFuncao(e.target.value)}
                className="h-9"
              />
            </div>

            <Button
              onClick={handleAddParticipante}
              disabled={!selectedParticipante || !funcao}
              className="h-9 w-full sm:w-auto mt-1 sm:mt-0"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>
        </div>

        <div className="border rounded-md shadow-sm overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Detalhes</TableHead>
                <TableHead>Função</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participantesPaginados.length ? (
                participantesPaginados.map((participante) => (
                  <TableRow key={participante.id} className="hover:bg-muted/50">
                    <TableCell>
                      {participante.tipo === 'ALUNO'
                        ? participante.aluno?.nome
                        : participante.user?.nome}
                    </TableCell>
                    <TableCell>
                      <span className="inline-block px-2 py-1 rounded bg-muted text-xs capitalize">
                        {participante.tipo.toLowerCase()}
                      </span>
                    </TableCell>
                    <TableCell>
                      {participante.tipo === 'ALUNO'
                        ? `${participante.aluno?.turma} - ${participante.aluno?.curso}`
                        : participante.user?.email}
                    </TableCell>
                    <TableCell>
                      <span className="inline-block px-2 py-1 rounded bg-muted text-xs">
                        {participante.funcao}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleRemoveParticipante(participante.id)
                        }
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Nenhum participante vinculado
                  </TableCell>
                </TableRow>
              )}
              <TableRow>
                <TableCell colSpan={5}>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 px-2">
                    <div className="text-sm text-muted-foreground">
                      Total: <strong>{participantes.length}</strong>{' '}
                      participantes
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        Página <strong>{currentPage + 1}</strong> de{' '}
                        <strong>{totalPaginas}</strong>
                      </span>

                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          disabled={currentPage === 0}
                          onClick={() => setCurrentPage((prev) => prev - 1)}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          disabled={endIndex >= participantes.length}
                          onClick={() => setCurrentPage((prev) => prev + 1)}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
