import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { UserSchemaType } from '@/schemas/userSchema'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { postUser, updateUser } from '@/api/apiUsers'
import type { User } from '@/utils/types'
import { UserSchema } from '@/schemas/userSchema'

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

  const onSubmit = async (values: UserSchemaType) => {
    try {
      if (user) {
        await updateUser(user.id, values)
      } else {
        await postUser(values)
      }
      onSuccess()
    } catch (error) {
      console.error('Erro ao salvar usuário:', error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email institucional" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cargo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cargo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ADMIN">Administrador</SelectItem>
                  <SelectItem value="COORDENADOR">Coordenador</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {!user && (
          <FormField
            control={form.control}
            name="senha"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input
                    type="senha"
                    placeholder="Senha (mínimo 6 caracteres)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? 'Salvando...'
              : user
              ? 'Atualizar'
              : 'Cadastrar'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
