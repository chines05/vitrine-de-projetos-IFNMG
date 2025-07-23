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
  Upload,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { deleteUser, getUsers } from '@/api/apiUsers'
import type { User } from '@/utils/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import toast from 'react-hot-toast'
import { UserForm } from '../forms/UserForm'
import { formatErrorMessage } from '@/utils/format'
import ExcluirUsuarioDialog from '../dialogs/ExcluirUsuarioDialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { CadastroEmLoteUserDialog } from '../dialogs/CadastroEmLoteUserDialog'
import { Input } from '../ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

const Usuarios = () => {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDialogDeleteOpen, setIsDialogDeleteOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [filterNome, setFilterNome] = useState('')
  const [filterEmail, setFilterEmail] = useState('')
  const [filterCargo, setFilterCargo] = useState('all')
  const [currentPage, setCurrentPage] = useState(0)
  const usuariosPorPagina = 10

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const data = await getUsers()
      setUsers(data)
      setIsDialogOpen(false)
    } catch (error) {
      toast.error(formatErrorMessage(error, 'Erro ao carregar usuários.'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (userId: string) => {
    try {
      await deleteUser(userId)
      fetchUsers()
      toast.success('Usuário excluído com sucesso!')
    } catch (error) {
      toast.error(formatErrorMessage(error, 'Erro ao excluir usuário.'))
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredUsers = users.filter((user) => {
    const matchNome = user.nome.toLowerCase().includes(filterNome.toLowerCase())
    const matchEmail = user.email
      .toLowerCase()
      .includes(filterEmail.toLowerCase())
    const matchCargo = filterCargo === 'all' || user.role === filterCargo

    return matchNome && matchEmail && matchCargo
  })

  const startIndex = currentPage * usuariosPorPagina
  const endIndex = startIndex + usuariosPorPagina
  const usuariosPaginados = filteredUsers.slice(startIndex, endIndex)

  return (
    <main>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Usuários</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setSelectedUser(null)}>
                <Plus className="mr-2 h-4 w-4" />
                Cadastrar Usuário
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {selectedUser ? 'Editar Usuário' : 'Cadastrar Usuário'}
                </DialogTitle>
              </DialogHeader>
              <UserForm user={selectedUser} onSuccess={fetchUsers} />
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
          className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
        />
        <Input
          type="text"
          value={filterEmail}
          onChange={(e) => setFilterEmail(e.target.value)}
          placeholder="Filtrar por email"
          className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
        />
        <Select
          value={filterCargo}
          onValueChange={(value: string) => setFilterCargo(value)}
        >
          <SelectTrigger className="w-full h-10">
            <SelectValue placeholder="Filtrar por cargo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os cargos</SelectItem>
            <SelectItem value="ADMIN">Administrador</SelectItem>
            <SelectItem value="COORDENADOR">Coordenador</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Cargo</TableHead>
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
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Nenhum usuário cadastrado
                </TableCell>
              </TableRow>
            ) : (
              usuariosPaginados.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.nome}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.role === 'ADMIN'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {user.role === 'ADMIN' ? 'Administrador' : 'Coordenador'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-10">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Pencil
                            className="h-4 w-4 cursor-pointer"
                            onClick={() => {
                              setSelectedUser(user)
                              setIsDialogOpen(true)
                            }}
                          />
                        </TooltipTrigger>
                        <TooltipContent>Editar Usuário</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Trash2
                            className="h-4 w-4 cursor-pointer text-red-600"
                            onClick={() => {
                              setSelectedUser(user)
                              setIsDialogDeleteOpen(true)
                            }}
                          />
                        </TooltipTrigger>
                        <TooltipContent>Excluir Usuário</TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
            <TableRow>
              <TableCell colSpan={4}>
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 px-2">
                  <div className="text-sm text-muted-foreground">
                    Total: <strong>{filteredUsers.length}</strong> usuários
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      Página <strong>{currentPage + 1}</strong> de{' '}
                      {Math.ceil(filteredUsers.length / usuariosPorPagina)}
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
                        disabled={endIndex >= filteredUsers.length}
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

      <ExcluirUsuarioDialog
        isOpen={isDialogDeleteOpen}
        onClose={() => setIsDialogDeleteOpen(false)}
        user={selectedUser}
        onDelete={handleDelete}
      />

      <CadastroEmLoteUserDialog
        isOpen={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        onSuccess={fetchUsers}
      />
    </main>
  )
}

export default Usuarios
