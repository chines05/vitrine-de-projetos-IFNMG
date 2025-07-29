import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Plus,
  Pencil,
  Trash2,
  Image,
  Users,
  Eye,
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import toast from 'react-hot-toast'
import { formatErrorMessage } from '@/utils/format'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { ProjetoType, UserType } from '@/utils/types'
import { Badge } from '@/components/ui/badge'
import { VincularAlunoDialog } from '@/components/dialogs/VincularAlunoDialog'
import { deleteProjeto, getProjetos } from '@/api/apiProjeto'
import { ProjetoForm } from '../forms/ProjetoForm'
import { ImagemUploadDialog } from '../dialogs/ ImagemUploadDialog'
import { ExcluirProjetoDialog } from '../dialogs/ExcluirProjetoDialog'
import { useNavigate } from 'react-router-dom'
import { Input } from '../ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Calendar } from '../ui/calendar'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

type Props = {
  user: UserType
}

const Projetos = ({ user }: Props) => {
  const navigate = useNavigate()
  const [projetos, setProjetos] = useState<ProjetoType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDialogDeleteOpen, setIsDialogDeleteOpen] = useState(false)
  const [isDialogAlunosOpen, setIsDialogAlunosOpen] = useState(false)
  const [isDialogImagensOpen, setIsDialogImagensOpen] = useState(false)
  const [selectedProjeto, setSelectedProjeto] = useState<ProjetoType | null>(
    null
  )
  const [filterTitulo, setFilterTitulo] = useState('')
  const [filterTipo, setFilterTipo] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCoordenadorId, setFilterCoordenadorId] = useState('all')
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [currentPage, setCurrentPage] = useState(0)
  const projetosPorPagina = 10

  const fetchProjetos = async () => {
    setIsLoading(true)
    try {
      const data = await getProjetos()
      setProjetos(data)
    } catch (error) {
      toast.error(formatErrorMessage(error, 'Erro ao carregar projetos.'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (projetoId: string) => {
    try {
      await deleteProjeto(projetoId)
      fetchProjetos()
      toast.success('Projeto excluído com sucesso!')
    } catch (error) {
      toast.error(formatErrorMessage(error, 'Erro ao excluir projeto.'))
    }
  }

  useEffect(() => {
    fetchProjetos()
  }, [])

  const coordenadoresUnicos: UserType[] = Array.from(
    new Map(projetos.map((p) => [p.coordenadorId, p.coordenador])).values()
  )

  const filteredProjetos = projetos.filter((projeto) => {
    const matchTitulo = projeto.titulo
      .toLowerCase()
      .includes(filterTitulo.toLowerCase())
    const matchTipo = filterTipo === 'all' || projeto.tipo === filterTipo
    const matchStatus =
      filterStatus === 'all' || projeto.status === filterStatus
    const matchCoordenador =
      filterCoordenadorId === 'all' ||
      projeto.coordenadorId === filterCoordenadorId

    const matchDataInicio =
      (!startDate || new Date(projeto.dataInicio) >= startDate) &&
      (!endDate || new Date(projeto.dataInicio) <= endDate)

    return (
      matchTitulo &&
      matchTipo &&
      matchStatus &&
      matchCoordenador &&
      matchDataInicio
    )
  })

  const startIndex = currentPage * projetosPorPagina
  const endIndex = startIndex + projetosPorPagina
  const alunosPaginados = filteredProjetos.slice(startIndex, endIndex)

  const limparFiltros = () => {
    setFilterTitulo('')
    setFilterTipo('all')
    setFilterStatus('all')
    setFilterCoordenadorId('all')
    setStartDate(undefined)
    setEndDate(undefined)
  }

  return (
    <main>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Projetos</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedProjeto(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Cadastrar Projeto
            </Button>
          </DialogTrigger>
          <DialogContent className="md:max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {selectedProjeto ? 'Editar Projeto' : 'Cadastrar Projeto'}
              </DialogTitle>
            </DialogHeader>
            <ProjetoForm
              projeto={selectedProjeto}
              onSuccess={() => {
                setIsDialogOpen(false)
                fetchProjetos()
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6 grid grid-cols-1  gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <Input
            type="text"
            value={filterTitulo}
            onChange={(e) => setFilterTitulo(e.target.value)}
            placeholder="Filtrar por título"
            className="h-10 text-sm w-full"
          />

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full h-10 justify-start text-left text-sm',
                  !startDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, 'dd/MM/yyyy') : 'Data início'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => setStartDate(date || undefined)}
                required
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full h-10 justify-start text-left text-sm',
                  !endDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, 'dd/MM/yyyy') : 'Data fim'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => setEndDate(date || undefined)}
                required
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select
            value={filterStatus}
            onValueChange={(value) => setFilterStatus(value)}
          >
            <SelectTrigger className="h-10 text-sm w-full">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="ATIVO">Ativo</SelectItem>
              <SelectItem value="CONCLUIDO">Concluído</SelectItem>
              <SelectItem value="PAUSADO">Pausado</SelectItem>
              <SelectItem value="CANCELADO">Cancelado</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filterCoordenadorId}
            onValueChange={setFilterCoordenadorId}
          >
            <SelectTrigger className="h-10 text-sm w-full">
              <SelectValue placeholder="Filtrar por coordenador" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Coordenadores</SelectItem>
              {coordenadoresUnicos.map((coord) => (
                <SelectItem key={coord.id} value={coord.id}>
                  {coord.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filterTipo}
            onValueChange={(value) => setFilterTipo(value)}
          >
            <SelectTrigger className="h-10 text-sm w-full">
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="PESQUISA">Pesquisa</SelectItem>
              <SelectItem value="ENSINO">Ensino</SelectItem>
              <SelectItem value="EXTENSAO">Extensão</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="text-sm" onClick={limparFiltros}>
            Limpar Filtros
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Período</TableHead>
              <TableHead>Coordenador</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : projetos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Nenhum projeto cadastrado
                </TableCell>
              </TableRow>
            ) : (
              alunosPaginados.map((projeto) => (
                <TableRow key={projeto.id}>
                  <TableCell className="font-medium">
                    {projeto.titulo}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {projeto.tipo.toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        projeto.status === 'ATIVO'
                          ? 'default'
                          : projeto.status === 'CONCLUIDO'
                          ? 'secondary'
                          : 'destructive'
                      }
                    >
                      {projeto.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(projeto.dataInicio).toLocaleDateString()} -{' '}
                    {projeto.dataFim
                      ? new Date(projeto.dataFim).toLocaleDateString()
                      : 'Presente'}
                  </TableCell>
                  <TableCell>{projeto.coordenador.nome}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-5">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Eye
                            className="h-4 w-4 cursor-pointer"
                            onClick={() =>
                              navigate(`/projeto/${projeto.id}`, {
                                state: user,
                              })
                            }
                          />
                        </TooltipTrigger>
                        <TooltipContent>Visualizar Projeto</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Image
                            className="h-4 w-4 cursor-pointer"
                            onClick={() => {
                              setSelectedProjeto(projeto)
                              setIsDialogImagensOpen(true)
                            }}
                          />
                        </TooltipTrigger>
                        <TooltipContent>Gerenciar Imagens</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Users
                            className="h-4 w-4 cursor-pointer"
                            onClick={() => {
                              setSelectedProjeto(projeto)
                              setIsDialogAlunosOpen(true)
                            }}
                          />
                        </TooltipTrigger>
                        <TooltipContent>Participantes</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Pencil
                            className="h-4 w-4 cursor-pointer"
                            onClick={() => {
                              setSelectedProjeto(projeto)
                              setIsDialogOpen(true)
                            }}
                          />
                        </TooltipTrigger>
                        <TooltipContent>Editar Projeto</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Trash2
                            className="h-4 w-4 cursor-pointer text-red-600"
                            onClick={() => {
                              setSelectedProjeto(projeto)
                              setIsDialogDeleteOpen(true)
                            }}
                          />
                        </TooltipTrigger>
                        <TooltipContent>Excluir Projeto</TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
            <TableRow>
              <TableCell colSpan={6}>
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 px-2">
                  <div className="text-sm text-muted-foreground">
                    Total: <strong>{filteredProjetos.length}</strong> projetos
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      Página <strong>{currentPage + 1}</strong> de{' '}
                      {Math.ceil(filteredProjetos.length / projetosPorPagina)}
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
                        disabled={endIndex >= filteredProjetos.length}
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

      <ExcluirProjetoDialog
        isOpen={isDialogDeleteOpen}
        onClose={() => setIsDialogDeleteOpen(false)}
        projeto={selectedProjeto}
        onDelete={handleDelete}
      />

      <VincularAlunoDialog
        isOpen={isDialogAlunosOpen}
        onClose={() => setIsDialogAlunosOpen(false)}
        projeto={selectedProjeto}
        onUpdateProjeto={fetchProjetos}
      />

      <ImagemUploadDialog
        isOpen={isDialogImagensOpen}
        onClose={() => setIsDialogImagensOpen(false)}
        projeto={selectedProjeto}
        onSuccess={fetchProjetos}
      />
    </main>
  )
}

export default Projetos
