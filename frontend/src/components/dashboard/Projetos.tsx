import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Pencil, Trash2, Image, Users, Eye } from 'lucide-react'
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
import type { ProjetoType } from '@/utils/types'
import { Badge } from '@/components/ui/badge'
import { VincularAlunoDialog } from '@/components/dialogs/VincularAlunoDialog'
import { deleteProjeto, getProjetos } from '@/api/apiProjeto'
import { ProjetoForm } from '../forms/ProjetoForm'
import { ImagemUploadDialog } from '../dialogs/ ImagemUploadDialog'
import { ExcluirProjetoDialog } from '../dialogs/ExcluirProjetoDialog'
import { useNavigate } from 'react-router-dom'

const Projetos = () => {
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
              projetos.map((projeto) => (
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
                            onClick={() => navigate(`/projeto/${projeto.id}`)}
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
        onSuccess={fetchProjetos}
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
