import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { CalendarIcon, Download } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { formatErrorMessage, cursosPermitidosTcc } from '@/utils/format'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { postTcc, updateTcc } from '@/api/apiTcc'
import { getAlunos } from '@/api/apiAlunos'
import { getCoordenadores } from '@/api/apiUsers'
import { tccSchema, type TccSchemaType } from '@/schemas/tccSchema'
import { type User, type Aluno, type TccType } from '@/utils/types'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'

interface Props {
  tcc?: TccType | null
  onSuccess: () => void
}

export const TccForm = ({ tcc, onSuccess }: Props) => {
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [coordenadores, setCoordenadores] = useState<User[]>([])
  const [filePreview, setFilePreview] = useState<string | null>(
    tcc?.file ? `/uploads/${tcc.file}` : null
  )

  const form = useForm<TccSchemaType>({
    resolver: zodResolver(tccSchema),
    defaultValues: {
      titulo: tcc?.titulo || '',
      curso: tcc?.curso || '',
      resumo: tcc?.resumo || '',
      dataDefesa: tcc?.dataDefesa
        ? format(new Date(tcc.dataDefesa), 'yyyy-MM-dd')
        : format(new Date(), 'yyyy-MM-dd'),
      alunoId: tcc?.alunoId || '',
      coordenadorId: tcc?.coordenadorId || '',
      file: undefined,
    },
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = form

  useEffect(() => {
    const loadData = async () => {
      try {
        const [alunoData, coordData] = await Promise.all([
          getAlunos(),
          getCoordenadores(),
        ])
        setAlunos(alunoData)
        setCoordenadores(coordData)
      } catch (error) {
        toast.error(formatErrorMessage(error, 'Erro ao carregar dados.'))
      }
    }
    loadData()
  }, [])

  const onSubmit = async (data: TccSchemaType) => {
    try {
      if (tcc?.id) {
        await updateTcc(tcc.id, data)
        toast.success('TCC atualizado com sucesso!')
      } else {
        await postTcc(data)
        toast.success('TCC cadastrado com sucesso!')
      }
      onSuccess()
    } catch (error) {
      toast.error(formatErrorMessage(error, 'Erro ao salvar TCC.'))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('O arquivo deve ter no máximo 5MB')
        return
      }
      if (file.type !== 'application/pdf') {
        toast.error('Apenas arquivos PDF são permitidos')
        return
      }
      setValue('file', file)
      setFilePreview(URL.createObjectURL(file))
    }
  }

  const renderError = (field: keyof TccSchemaType) => {
    const error = errors[field]
    return (
      error && (
        <span className="text-red-500 text-xs mt-1 block">{error.message}</span>
      )
    )
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setValue('dataDefesa', format(date, 'yyyy-MM-dd'))
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label>Título*</Label>
          <Input
            {...register('titulo')}
            placeholder="Título do TCC"
            className={errors.titulo ? 'border-red-500' : ''}
          />
          {renderError('titulo')}
        </div>

        <div className="space-y-2">
          <Label>Resumo*</Label>
          <Textarea
            {...register('resumo')}
            placeholder="Resumo do trabalho"
            rows={5}
            className={errors.resumo ? 'border-red-500' : ''}
          />
          {renderError('resumo')}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Data de Defesa*</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full h-10 justify-start text-left text-sm',
                  !watch('dataDefesa') && 'text-muted-foreground',
                  errors.dataDefesa && 'border-red-500'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {watch('dataDefesa') ? (
                  format(watch('dataDefesa'), 'dd/MM/yyyy')
                ) : (
                  <span>Selecione a data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={
                  watch('dataDefesa')
                    ? new Date(watch('dataDefesa'))
                    : undefined
                }
                onSelect={handleDateSelect}
                initialFocus
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
          {renderError('dataDefesa')}
        </div>

        <div className="space-y-2">
          <Label>Curso*</Label>
          <Select
            value={watch('curso')}
            onValueChange={(val) => setValue('curso', val)}
          >
            <SelectTrigger className={errors.curso ? 'border-red-500' : ''}>
              <SelectValue placeholder="Selecione o curso" />
            </SelectTrigger>
            <SelectContent>
              {cursosPermitidosTcc.map((curso) => (
                <SelectItem key={curso} value={curso}>
                  {curso
                    .replace(/_/g, ' ')
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {renderError('curso')}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Aluno*</Label>
          <Select
            value={watch('alunoId')}
            onValueChange={(val) => setValue('alunoId', val)}
          >
            <SelectTrigger className={errors.alunoId ? 'border-red-500' : ''}>
              <SelectValue placeholder="Selecione o aluno" />
            </SelectTrigger>
            <SelectContent>
              {alunos.map((aluno) => (
                <SelectItem key={aluno.id} value={aluno.id}>
                  {aluno.nome} - {aluno.turma}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {renderError('alunoId')}
        </div>

        <div className="space-y-2">
          <Label>Coordenador*</Label>
          <Select
            value={watch('coordenadorId')}
            onValueChange={(val) => setValue('coordenadorId', val)}
          >
            <SelectTrigger
              className={errors.coordenadorId ? 'border-red-500' : ''}
            >
              <SelectValue placeholder="Selecione o coordenador" />
            </SelectTrigger>
            <SelectContent>
              {coordenadores.map((coord) => (
                <SelectItem key={coord.id} value={coord.id}>
                  {coord.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {renderError('coordenadorId')}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Arquivo do TCC (PDF)*</Label>
        <div className="flex items-center gap-4">
          <Input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className={errors.file ? 'border-red-500' : ''}
          />
          {filePreview && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => window.open(filePreview, '_blank')}
            >
              <Download className="mr-2 h-4 w-4" />
              Visualizar
            </Button>
          )}
        </div>
        {renderError('file')}
        <p className="text-xs text-muted-foreground mt-1">
          Tamanho máximo: 5MB | Formato: PDF
        </p>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full mt-6">
        {isSubmitting ? 'Salvando...' : tcc ? 'Atualizar TCC' : 'Cadastrar TCC'}
      </Button>
    </form>
  )
}
