import { Card } from '@/components/ui/card'
import background from '/background.jpg'
import logoIFNMG from '/logo.png'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginSchema } from '@/schemas/loginSchema'
import type { LoginSchemaType } from '@/schemas/loginSchema'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import api from '@/utils/api'

const Login = () => {
  const router = useNavigate()
  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: 'chines@ifnmg.edu.br',
      password: 'Chines05',
    },
  })

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = form

  const onSubmit = async (data: LoginSchemaType) => {
    try {
      await api.post('/login', data)
      toast.success('Login realizado com sucesso!')
      router('/dashboard')
    } catch (error) {
      toast.error('Erro ao realizar login.')
      console.error(error)
    }
  }

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center">
      <div className="absolute inset-0 z-0">
        <img
          src={background}
          alt=""
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute bg-black opacity-30 inset-0 z-0" />
      </div>

      <Card className="z-10 w-[350px] flex flex-col items-center justify-center p-7">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full"
        >
          <div className="flex justify-center">
            <img src={logoIFNMG} alt="Logo IFNMG" className="w-52 h-auto" />
          </div>

          <h1 className="text-2xl font-semibold text-center">
            Vitrine de Projetos
          </h1>

          <div className="w-full">
            <Label className="mb-2">E-mail</Label>
            <Input type="email" placeholder="E-mail" {...register('email')} />
            {errors.email && (
              <span className="text-red-500 text-xs mt-1 block">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="w-full">
            <Label className="mb-2">Senha</Label>
            <Input
              type="password"
              placeholder="Senha"
              {...register('password')}
            />
            {errors.password && (
              <span className="text-red-500 text-xs mt-1 block">
                {errors.password.message}
              </span>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Carregando...' : 'Entrar'}
          </Button>
        </form>
      </Card>
    </main>
  )
}

export default Login
