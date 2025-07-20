import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserSchema } from '@/schemas/userSchema'
import type { UserSchemaType } from '@/schemas/userSchema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { postUser, updateUser } from '@/api/apiUsers'
import type { User } from '@/utils/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import toast from 'react-hot-toast'

interface UserFormProps {
  user?: User | null
  onSuccess: () => void
}

export const UserForm = ({ user, onSuccess }: UserFormProps) => {
  const form = useForm<UserSchemaType>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      nome: user?.nome || '',
      email: user?.email || '',
      role: user?.role || 'COORDENADOR',
      senha: '',
    },
  })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting, errors },
  } = form

  const onSubmit = async (values: UserSchemaType) => {
    try {
      if (user) {
        await updateUser(user.id, values)
        toast.success('Usuário atualizado com sucesso!')
      } else {
        await postUser({ ...values, senha: values.senha ?? '' })
        toast.success('Usuário cadastrado com sucesso!')
      }
      onSuccess()
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao salvar usuário')
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5 w-full"
    >
      <div className="w-full">
        <Label className="mb-2">Nome</Label>
        <Input type="text" placeholder="Nome completo" {...register('nome')} />
        {errors.nome && (
          <span className="text-red-500 text-xs mt-1 block">
            {errors.nome.message}
          </span>
        )}
      </div>

      <div className="w-full">
        <Label className="mb-2">Email</Label>
        <Input
          type="email"
          placeholder="Email institucional"
          {...register('email')}
        />
        {errors.email && (
          <span className="text-red-500 text-xs mt-1 block">
            {errors.email.message}
          </span>
        )}
      </div>

      <div className="w-full">
        <Label className="mb-2">Cargo</Label>
        <Select
          onValueChange={(value: 'ADMIN' | 'COORDENADOR') =>
            setValue('role', value)
          }
          defaultValue={watch('role')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um cargo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ADMIN">Administrador</SelectItem>
            <SelectItem value="COORDENADOR">Coordenador</SelectItem>
          </SelectContent>
        </Select>
        {errors.role && (
          <span className="text-red-500 text-xs mt-1 block">
            {errors.role.message}
          </span>
        )}
      </div>

      <div className="w-full">
        <Label className="mb-2">Senha</Label>
        <Input
          type="password"
          placeholder="Senha (mínimo 6 caracteres)"
          {...register('senha')}
        />
        {errors.senha && (
          <span className="text-red-500 text-xs mt-1 block">
            {errors.senha.message}
          </span>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Salvando...' : user ? 'Atualizar' : 'Cadastrar'}
      </Button>
    </form>
  )
}
