import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
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
import { Input } from '../ui/input'

const Alunos = () => {
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDialogDeleteOpen, setIsDialogDeleteOpen] = useState(false)
  const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [filterNome, setFilterNome] = useState('')
  const [filterTurma, setFilterTurma] = useState('')
  const [filterCurso, setFilterCurso] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const alunosPorPagina = 10

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

  const filteredAlunos = alunos.filter((aluno) => {
    const matchNome = aluno.nome
      .toLowerCase()
      .includes(filterNome.toLowerCase())
    const matchTurma = aluno.turma
      .toLowerCase()
      .includes(filterTurma.toLowerCase())
    const matchCurso = aluno.curso
      .toLowerCase()
      .includes(filterCurso.toLowerCase())

    return matchNome && matchTurma && matchCurso
  })

  const startIndex = currentPage * alunosPorPagina
  const endIndex = startIndex + alunosPorPagina
  const alunosPaginados = filteredAlunos.slice(startIndex, endIndex)

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

      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          type="text"
          value={filterNome}
          onChange={(e) => setFilterNome(e.target.value)}
          placeholder="Filtrar por nome"
          className="w-full h-9 text-sm"
        />
        <Input
          type="text"
          value={filterTurma}
          onChange={(e) => setFilterTurma(e.target.value)}
          placeholder="Filtrar por turma"
          className="w-full h-9 text-sm"
        />
        <Input
          type="text"
          value={filterCurso}
          onChange={(e) => setFilterCurso(e.target.value)}
          placeholder="Filtrar por curso"
          className="w-full h-9 text-sm"
        />
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
              alunosPaginados.map((aluno) => (
                <TableRow key={aluno.id}>
                  <TableCell>{aluno.nome}</TableCell>
                  <TableCell>{aluno.turma}</TableCell>
                  <TableCell>{aluno.curso}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-10">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Pencil
                            className="h-4 w-4 cursor-pointer"
                            onClick={() => {
                              setSelectedAluno(aluno)
                              setIsDialogOpen(true)
                            }}
                          />
                        </TooltipTrigger>
                        <TooltipContent>Editar Aluno</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Trash2
                            className="h-4 w-4 cursor-pointer text-red-600"
                            onClick={() => {
                              setSelectedAluno(aluno)
                              setIsDialogDeleteOpen(true)
                            }}
                          />
                        </TooltipTrigger>
                        <TooltipContent>Excluir Aluno</TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
            <TableRow>
              <TableCell colSpan={4}>
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mt-4 px-2">
                  <div className="text-sm text-muted-foreground">
                    Total: <strong>{filteredAlunos.length}</strong> alunos
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      Página <strong>{currentPage + 1}</strong> de{' '}
                      {Math.ceil(filteredAlunos.length / alunosPorPagina)}
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
                        disabled={endIndex >= filteredAlunos.length}
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
