import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import type { Aluno } from '@/utils/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import toast from 'react-hot-toast'
import { formatErrorMessage } from '@/utils/format'
import ExcluirAlunoDialog from '../dialogs/ExcluirAlunoDialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { deleteAluno, getAlunos } from '@/api/apiAlunos'
import { AlunoForm } from '../forms/AlunoForm'
import { Upload } from 'lucide-react'
import { CadastroEmLoteAlunoDialog } from '../dialogs/CadastroEmLoteAlunoDialog'

const Alunos = () => {
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDialogDeleteOpen, setIsDialogDeleteOpen] = useState(false)
  const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)

  const fecthALunos = async () => {
    setIsLoading(true)
    try {
      const data = await getAlunos()
      setAlunos(data)
      setIsDialogOpen(false)
    } catch (error) {
      toast.error(formatErrorMessage(error, 'Erro ao carregar alunos.'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (alunoId: string) => {
    try {
      await deleteAluno(alunoId)
      fecthALunos()
      toast.success('Aluno excluído com sucesso!')
    } catch (error) {
      toast.error(formatErrorMessage(error, 'Erro ao excluir aluno.'))
    }
  }

  useEffect(() => {
    fecthALunos()
  }, [])

  return (
    <main>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Alunos</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setSelectedAluno(null)}>
                <Plus className="mr-2 h-4 w-4" />
                Cadastrar Aluno
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {selectedAluno ? 'Editar Aluno' : 'Cadastrar Aluno'}
                </DialogTitle>
              </DialogHeader>
              <AlunoForm aluno={selectedAluno} onSuccess={fecthALunos} />
            </DialogContent>
          </Dialog>

          <Button onClick={() => setIsImportDialogOpen(true)} variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Importar CSV
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Turma</TableHead>
              <TableHead>Curso</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : alunos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Nenhum aluno cadastrado
                </TableCell>
              </TableRow>
            ) : (
              alunos.map((aluno) => (
                <TableRow key={aluno.id}>
                  <TableCell>{aluno.nome}</TableCell>
                  <TableCell>{aluno.turma}</TableCell>
                  <TableCell>{aluno.curso}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedAluno(aluno)
                              setIsDialogOpen(true)
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Editar Aluno</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedAluno(aluno)
                              setIsDialogDeleteOpen(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Excluir Aluno</TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ExcluirAlunoDialog
        isOpen={isDialogDeleteOpen}
        onClose={() => setIsDialogDeleteOpen(false)}
        aluno={selectedAluno}
        onDelete={handleDelete}
      />

      <CadastroEmLoteAlunoDialog
        isOpen={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        onSuccess={fecthALunos}
      />
    </main>
  )
}

export default Alunos
