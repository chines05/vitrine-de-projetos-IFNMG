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
import { Trash2, Plus } from 'lucide-react'
import { getAlunos } from '@/api/apiAlunos'
import { useEffect, useState } from 'react'
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
import { deleteProjetoAluno, postProjetoAluno } from '@/api/apiProjeto'

interface VincularAlunoDialogProps {
  isOpen: boolean
  onClose: () => void
  projeto: ProjetoType | null
  onSuccess: () => void
}

export const VincularAlunoDialog = ({
  isOpen,
  onClose,
  projeto,
  onSuccess,
}: VincularAlunoDialogProps) => {
  const [alunos, setAlunos] = useState<AlunoSchemaType[]>([])

  const fetchAlunos = async () => {
    try {
      const data = await getAlunos()
      setAlunos(data)
    } catch (error) {
      toast.error(formatErrorMessage(error, 'Erro ao carregar alunos.'))
    }
  }

  useEffect(() => {
    fetchAlunos()
  }, [])

  const [selectedAluno, setSelectedAluno] = useState('')
  const [funcao, setFuncao] = useState('')

  const handleAddAluno = async () => {
    if (!projeto || !selectedAluno || !funcao) return

    try {
      await postProjetoAluno(projeto.id, selectedAluno, funcao)
      toast.success('Aluno vinculado com sucesso!')
      onSuccess()
      setSelectedAluno('')
      setFuncao('')
    } catch (error) {
      toast.error(formatErrorMessage(error, 'Erro ao vincular aluno'))
    }
  }

  const handleRemoveAluno = async (vinculoId: string) => {
    try {
      await deleteProjetoAluno(vinculoId)
      toast.success('Aluno removido do projeto!')
      onSuccess()
    } catch (error) {
      toast.error(formatErrorMessage(error, 'Erro ao remover aluno'))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Participantes do Projeto: {projeto?.titulo}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Select value={selectedAluno} onValueChange={setSelectedAluno}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um aluno" />
              </SelectTrigger>
              <SelectContent>
                {alunos?.map((aluno) => (
                  <SelectItem key={aluno.id} value={aluno.id}>
                    {aluno.nome} - {aluno.turma}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="Função (ex: Bolsista)"
              value={funcao}
              onChange={(e) => setFuncao(e.target.value)}
            />

            <Button onClick={handleAddAluno}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Turma</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projeto?.participantes?.length ? (
                  projeto.participantes.map((participante) => (
                    <TableRow key={participante.id}>
                      <TableCell>{participante.aluno.nome}</TableCell>
                      <TableCell>{participante.aluno.turma}</TableCell>
                      <TableCell>{participante.funcao}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveAluno(participante.id)}
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
              </TableBody>
            </Table>
          </div>
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
