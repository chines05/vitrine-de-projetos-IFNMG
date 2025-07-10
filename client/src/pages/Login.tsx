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
    formState: { errors },
  } = form

  const onSubmit = async (data: LoginSchemaType) => {
    try {
      console.log(data)

      toast.success('Login realizado com sucesso!')

      router('/dashboard')
    } catch (error) {
      toast.error('Erro ao realizar login.')
      console.error(error)
    }
  }

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center">
      <div className="absolute inset-0 z-0">
        <img
          src={background}
          alt=""
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute bg-black opacity-30 inset-0 z-0" />
      </div>

      <Card className="z-10 w-[350px] flex flex-col items-center justify-center p-7">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <img src={logoIFNMG} alt="Logo IFNMG" />
          <h1 className="text-2xl text-center">Vitrine de Projetos</h1>

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

          <Button type="submit">Entrar</Button>
        </form>
      </Card>
    </section>
  )
}

export default Login
