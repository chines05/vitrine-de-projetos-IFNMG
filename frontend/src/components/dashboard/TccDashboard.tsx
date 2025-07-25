import { useEffect, useState } from 'react'
import {
  Plus,
  Trash2,
  Pencil,
  Download,
  ChevronLeft,
  ChevronRight,
  Eye,
} from 'lucide-react'
import { getTccs, deleteTcc, downloadTcc } from '@/api/apiTcc'
import { format } from 'date-fns'
import type { TccType } from '@/utils/types'
import toast from 'react-hot-toast'
import { cursosPermitidosTcc, formatErrorMessage } from '@/utils/format'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { useNavigate } from 'react-router-dom'
import { TccForm } from '../forms/TccForm'
import { ExcluirTccDialog } from '../dialogs/ExcluirTccDialog'
import { Badge } from '../ui/badge'

const TccDashboard = () => {
  const navigate = useNavigate()
  const [tccs, setTccs] = useState<TccType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedTcc, setSelectedTcc] = useState<TccType | null>(null)
  const [filterCurso, setFilterCurso] = useState('all')
  const [filterTitulo, setFilterTitulo] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const tccsPorPagina = 10

  const fetchTccs = async () => {
    setIsLoading(true)
    try {
      const data = await getTccs()
      setTccs(data)
    } catch (error) {
      toast.error(formatErrorMessage(error, 'Erro ao carregar TCCs.'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTccs()
  }, [])

  const handleDeleteClick = (tccId: string) => {
    setSelectedTcc(tccs.find((t) => t.id === tccId) || null)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async (tccId: string) => {
    try {
      await deleteTcc(tccId)
      await fetchTccs()
      toast.success('TCC excluído com sucesso!')
    } catch (error) {
      toast.error(formatErrorMessage(error, 'Erro ao excluir TCC.'))
    }
  }

  const handleDownload = async (tccId: string, fileName: string) => {
    try {
      await downloadTcc(tccId, fileName)
    } catch (error) {
      toast.error(formatErrorMessage(error, 'Erro ao baixar arquivo.'))
    }
  }

  const handleViewDetails = (tccId: string) => {
    navigate(`/tcc/${tccId}`)
  }

  const filteredTccs = tccs.filter((tcc) => {
    const matchCurso = filterCurso === 'all' || tcc.curso === filterCurso
    const matchTitulo = tcc.titulo
      .toLowerCase()
      .includes(filterTitulo.toLowerCase())
    return matchCurso && matchTitulo
  })

  const totalPages = Math.ceil(filteredTccs.length / tccsPorPagina)
  const startIndex = currentPage * tccsPorPagina
  const endIndex = startIndex + tccsPorPagina
  const tccsPaginados = filteredTccs.slice(startIndex, endIndex)

  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Trabalhos de Conclusão de Curso</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedTcc(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Novo TCC
            </Button>
          </DialogTrigger>
          <DialogContent className="md:max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {selectedTcc ? 'Editar TCC' : 'Cadastrar Novo TCC'}
              </DialogTitle>
            </DialogHeader>
            <TccForm
              tcc={selectedTcc}
              onSuccess={() => {
                fetchTccs()
                setIsDialogOpen(false)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="text"
          value={filterTitulo}
          onChange={(e) => {
            setFilterTitulo(e.target.value)
            setCurrentPage(0)
          }}
          placeholder="Filtrar por título..."
          className="h-10 text-sm"
        />
        <Select
          value={filterCurso}
          onValueChange={(value) => {
            setFilterCurso(value)
            setCurrentPage(0)
          }}
        >
          <SelectTrigger className="h-10 text-sm">
            <SelectValue placeholder="Filtrar por curso" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {cursosPermitidosTcc.map((curso) => (
              <SelectItem key={curso} value={curso}>
                {curso}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Curso</TableHead>
              <TableHead>Autor</TableHead>
              <TableHead>Data de Defesa</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Carregando TCCs...
                </TableCell>
              </TableRow>
            ) : tccsPaginados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Nenhum TCC encontrado
                </TableCell>
              </TableRow>
            ) : (
              tccsPaginados.map((tcc) => (
                <TableRow key={tcc.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{tcc.titulo}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {tcc.curso.replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>{tcc.aluno?.nome}</TableCell>
                  <TableCell>
                    {format(new Date(tcc.dataDefesa), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-3">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDetails(tcc.id)}
                          >
                            <Eye className="h-4 w-4 text-gray-600" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Visualizar TCC</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDownload(tcc.id, tcc.file)}
                          >
                            <Download className="h-4 w-4 text-blue-600" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Baixar TCC</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedTcc(tcc)
                              setIsDialogOpen(true)
                            }}
                          >
                            <Pencil className="h-4 w-4 text-gray-600" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Editar TCC</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(tcc.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Excluir TCC</TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
            <TableRow>
              <TableCell colSpan={5}>
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 px-2">
                  <div className="text-sm text-muted-foreground">
                    Total: <strong>{filteredTccs.length}</strong> TCCs
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      Página <strong>{currentPage + 1}</strong> de{' '}
                      {Math.ceil(filteredTccs.length / tccsPorPagina)}
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
                        disabled={currentPage + 1 >= totalPages}
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

      <ExcluirTccDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        tcc={selectedTcc}
        onDelete={handleConfirmDelete}
      />
    </main>
  )
}

export default TccDashboard
