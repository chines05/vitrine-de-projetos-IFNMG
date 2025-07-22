import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Pencil, Trash2, Upload } from 'lucide-react'
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
import { UserForm } from '../UserForm'
import { formatErrorMessage } from '@/utils/format'
import ExcluirUsuarioDialog from '../dialog/ExcluirUsuarioDialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { CadastroEmLoteUserDialog } from '../dialog/CadastroEmLoteUserDialog'

const Usuarios = () => {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDialogDeleteOpen, setIsDialogDeleteOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)

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
              users.map((user) => (
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
                    <div className="flex justify-end gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user)
                              setIsDialogOpen(true)
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Editar Usuário</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user)
                              setIsDialogDeleteOpen(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Excluir Usuário</TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
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
