import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlunoSchema, type AlunoSchemaType } from '@/schemas/alunoSchema'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { formatErrorMessage } from '@/utils/format'
import { postAluno, updateAluno } from '@/api/apiAlunos'

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
    formState: { isSubmitting, errors },
  } = form

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
      {['nome', 'turma', 'curso'].map((field) => (
        <div className="w-full" key={field}>
          <Label className="mb-2 capitalize">{field}</Label>
          <Input
            type="text"
            placeholder={field}
            {...register(field as keyof AlunoSchemaType)}
          />
          {errors[field as keyof AlunoSchemaType] && (
            <span className="text-red-500 text-xs mt-1 block">
              {errors[field as keyof AlunoSchemaType]?.message}
            </span>
          )}
        </div>
      ))}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Salvando...' : aluno ? 'Atualizar' : 'Cadastrar'}
      </Button>
    </form>
  )
}
