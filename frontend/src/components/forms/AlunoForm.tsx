import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlunoSchema, type AlunoSchemaType } from '@/schemas/alunoSchema'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import {
  cursosPermitidos,
  formatErrorMessage,
  turmasPermitidas,
} from '@/utils/format'
import { postAluno, updateAluno } from '@/api/apiAlunos'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { useEffect } from 'react'

interface Props {
  aluno?: AlunoSchemaType | null
  onSuccess: () => void
}

export const AlunoForm = ({ aluno, onSuccess }: Props) => {
  const form = useForm<AlunoSchemaType>({
    resolver: zodResolver(AlunoSchema),
    defaultValues: {
      id: aluno?.id,
      nome: aluno?.nome || '',
      turma: aluno?.turma || '',
      curso: aluno?.curso || '',
    },
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = form

  useEffect(() => {
    form.register('turma')
    form.register('curso')
  }, [form])

  const onSubmit = async (data: AlunoSchemaType) => {
    try {
      if (aluno) {
        await updateAluno(aluno.id!, data)
        toast.success('Aluno atualizado com sucesso!')
      } else {
        await postAluno(data)
        toast.success('Aluno cadastrado com sucesso!')
      }
      onSuccess()
    } catch (error) {
      toast.error(formatErrorMessage(error, 'Erro ao salvar aluno.'))
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5 w-full"
    >
      <div className="w-full">
        <Label className="mb-2">Nome</Label>
        <Input type="text" placeholder="Nome" {...register('nome')} />
        {errors.nome && (
          <span className="text-red-500 text-xs mt-1 block">
            {errors.nome.message}
          </span>
        )}
      </div>

      <div className="w-full">
        <Label className="mb-2">Turma</Label>
        <Select
          value={watch('turma')}
          onValueChange={(val: AlunoSchemaType['turma']) =>
            setValue('turma', val)
          }
        >
          <SelectTrigger className="w-full h-9">
            <SelectValue placeholder="Selecione uma turma" />
          </SelectTrigger>
          <SelectContent>
            {turmasPermitidas.map((turma) => (
              <SelectItem key={turma} value={turma}>
                {turma}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.turma && (
          <span className="text-red-500 text-xs mt-1 block">
            {errors.turma.message}
          </span>
        )}

        {errors.turma && (
          <span className="text-red-500 text-xs mt-1 block">
            {errors.turma.message}
          </span>
        )}
      </div>

      <div className="w-full">
        <Label className="mb-2">Curso</Label>
        <Select
          value={watch('curso')}
          onValueChange={(val: AlunoSchemaType['curso']) =>
            setValue('curso', val)
          }
        >
          <SelectTrigger className="w-full h-9">
            <SelectValue placeholder="Selecione um curso" />
          </SelectTrigger>
          <SelectContent>
            {cursosPermitidos.map((curso) => (
              <SelectItem key={curso} value={curso}>
                {curso}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.curso && (
          <span className="text-red-500 text-xs mt-1 block">
            {errors.curso.message}
          </span>
        )}

        {errors.curso && (
          <span className="text-red-500 text-xs mt-1 block">
            {errors.curso.message}
          </span>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Salvando...' : aluno ? 'Atualizar' : 'Cadastrar'}
      </Button>
    </form>
  )
}
