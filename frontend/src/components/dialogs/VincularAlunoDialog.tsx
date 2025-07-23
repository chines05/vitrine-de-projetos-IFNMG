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
import { getAlunos } from '@/api/apiAlunos'
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
import type { ProjetoType } from '@/utils/types'
import type { AlunoSchemaType } from '@/schemas/alunoSchema'
import {
  deleteProjetoAluno,
  getProjetoById,
  postProjetoAluno,
} from '@/api/apiProjeto'

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
  const [alunos, setAlunos] = useState<AlunoSchemaType[]>([])
  const [projetoData, setProjetoData] = useState<ProjetoType>()
  const [selectedAluno, setSelectedAluno] = useState('')
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

  const fetchProjetoById = useCallback(async () => {
    if (!projeto) return
    try {
      const data = await getProjetoById(projeto.id)
      setProjetoData(data)
    } catch (error) {
      toast.error(formatErrorMessage(error, 'Erro ao carregar alunos.'))
    }
  }, [projeto])

  useEffect(() => {
    fetchAlunos()
  }, [])

  useEffect(() => {
    if (isOpen && projeto) {
      fetchAlunos()
      fetchProjetoById()
    }
  }, [isOpen, projeto, fetchProjetoById])

  const handleAddAluno = async () => {
    if (!projeto || !selectedAluno || !funcao) return

    const payload = {
      funcao: funcao,
    }

    try {
      await postProjetoAluno(projeto.id, selectedAluno, payload)
      toast.success('Aluno vinculado com sucesso!')
      onUpdateProjeto()
      await fetchProjetoById()
      setSelectedAluno('')
      setFuncao('')
    } catch (error) {
      toast.error(formatErrorMessage(error, 'Erro ao vincular aluno'))
    }
  }

  const handleRemoveAluno = async (vinculoId: string) => {
    if (!projeto) return

    try {
      await deleteProjetoAluno(projeto.id, vinculoId)
      toast.success('Aluno removido do projeto!')
      onUpdateProjeto()
      await fetchProjetoById()
    } catch (error) {
      toast.error(formatErrorMessage(error, 'Erro ao remover aluno'))
    }
  }

  const participantes = projetoData?.participantes ?? []
  const startIndex = currentPage * participantesPorPagina
  const endIndex = startIndex + participantesPorPagina
  const participantesPaginados = participantes.slice(startIndex, endIndex)
  const totalPaginas = Math.ceil(participantes.length / participantesPorPagina)

  useEffect(() => {
    if (!isOpen) setCurrentPage(0)
  }, [isOpen])

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
          <div className="space-y-1">
            <label className="text-sm font-medium">Aluno*</label>
            <Select value={selectedAluno} onValueChange={setSelectedAluno}>
              <SelectTrigger className="h-9 w-full">
                <SelectValue placeholder="Selecione um aluno" />
              </SelectTrigger>
              <SelectContent>
                {alunos?.map((aluno) =>
                  aluno.id ? (
                    <SelectItem key={aluno.id} value={aluno.id}>
                      {aluno.nome} - {aluno.turma}
                    </SelectItem>
                  ) : null
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            <div className="space-y-1">
              <label className="text-sm font-medium">Função*</label>
              <Input
                placeholder="Ex: Engenheiro de Software"
                value={funcao}
                onChange={(e) => setFuncao(e.target.value)}
                className="h-9"
              />
            </div>

            <Button
              onClick={handleAddAluno}
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
                <TableHead>Aluno</TableHead>
                <TableHead>Turma</TableHead>
                <TableHead>Função</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participantesPaginados.length ? (
                participantesPaginados.map((participante) => (
                  <TableRow key={participante.id} className="hover:bg-muted/50">
                    <TableCell>{participante.aluno.nome}</TableCell>
                    <TableCell>{participante.aluno.turma}</TableCell>
                    <TableCell>
                      <span className="inline-block px-2 py-1 rounded bg-muted text-xs">
                        {participante.funcao}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveAluno(participante.aluno.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Nenhum aluno vinculado
                  </TableCell>
                </TableRow>
              )}
              <TableRow>
                <TableCell colSpan={6}>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 px-2">
                    <div className="text-sm text-muted-foreground">
                      Total: <strong>{participantes.length}</strong> alunos
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
