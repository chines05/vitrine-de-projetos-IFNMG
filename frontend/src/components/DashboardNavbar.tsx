import { User as UserIcon, ChevronDown, LogOut, Key } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { logout } from '@/api/apiAuth'
import toast from 'react-hot-toast'
import type { User } from '@/utils/types'
import { updateSenhaUser } from '@/api/apiUsers'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  updateSenhaSchema,
  type UpdateSenhaSchemaType,
} from '@/schemas/updateSenhaSchema'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'

type Props = {
  user: User
}

export function DashboardNavbar({ user }: Props) {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isUpdateSenhaOpen, setIsUpdateSenhaOpen] = useState(false)
  const navigate = useNavigate()

  const form = useForm<UpdateSenhaSchemaType>({
    resolver: zodResolver(updateSenhaSchema),
    defaultValues: {
      senhaAtual: '',
      novaSenha: '',
      confirmarSenha: '',
    },
  })

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = form

  const handleLogout = () => {
    logout()
    navigate('/login')
    toast.success('Logout realizado com sucesso!')
  }

  const onSubmit = async (data: UpdateSenhaSchemaType) => {
    try {
      await updateSenhaUser(user.id, data)
      toast.success('Senha atualizada com sucesso!')
      setIsUpdateSenhaOpen(false)
      reset()
    } catch (error: any) {
      toast.error(error.response.data.error || 'Erro ao atualizar senha.')
    }
  }

  return (
    <header className="w-full bg-gradient-to-r from-[#2f9e41] to-[#1BA863] shadow-sm fixed top-0 left-0 right-0 z-20 h-16 border-b border-white/10">
      <div className="flex items-center justify-end h-full px-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 group"
              variant="unstyled"
            >
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <UserIcon className="h-4 w-4 text-white" />
              </div>
              <span className="font-medium text-white">{user.nome}</span>
              <ChevronDown
                className={`h-4 w-4 text-white transition-transform ${
                  isProfileOpen ? 'rotate-180' : ''
                }`}
              />
            </Button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <Button
                  onClick={() => {
                    setIsProfileOpen(false)
                    setIsUpdateSenhaOpen(true)
                  }}
                  className="flex gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  variant="unstyled"
                >
                  <Key className="h-4 w-4" />
                  <span>Alterar senha</span>
                </Button>
                <Button
                  onClick={handleLogout}
                  className="flex gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  variant="unstyled"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sair</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={isUpdateSenhaOpen} onOpenChange={setIsUpdateSenhaOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Senha</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label className="mb-2">Senha Atual</Label>
              <Input
                id="senhaAtual"
                type="password"
                {...register('senhaAtual')}
                placeholder="Digite sua senha atual"
              />
              {errors.senhaAtual && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.senhaAtual.message}
                </p>
              )}
            </div>

            <div>
              <Label className="mb-2">Nova Senha</Label>
              <Input
                id="novaSenha"
                type="password"
                {...register('novaSenha')}
                placeholder="Digite a nova senha"
              />
              {errors.novaSenha && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.novaSenha.message}
                </p>
              )}
            </div>

            <div>
              <Label className="mb-2">Confirmar Nova Senha</Label>
              <Input
                id="confirmarSenha"
                type="password"
                {...register('confirmarSenha')}
                placeholder="Confirme a nova senha"
              />
              {errors.confirmarSenha && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmarSenha.message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsUpdateSenhaOpen(false)
                  reset()
                }}
              >
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </header>
  )
}
