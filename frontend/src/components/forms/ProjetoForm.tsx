import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ProjetoSchema, type ProjetoSchemaType } from '@/schemas/projetoSchema'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { formatErrorMessage } from '@/utils/format'
import { postProjeto, updateProjeto } from '@/api/apiProjeto'
import { getCoordenadores } from '@/api/apiUsers'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import type { User } from '@/utils/types'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Calendar } from '../ui/calendar'

interface ProjetoFormProps {
  projeto?: ProjetoSchemaType | null
  onSuccess: () => void
}

export const ProjetoForm = ({ projeto, onSuccess }: ProjetoFormProps) => {
  const [coordenadores, setCoordenadores] = useState<User[]>([])

  const fetchCoordenadores = async () => {
    try {
      const data = await getCoordenadores()
      setCoordenadores(data)
    } catch (error) {
      toast.error(formatErrorMessage(error, 'Erro ao carregar coordenadores.'))
    }
  }

  useEffect(() => {
    fetchCoordenadores()
  }, [])

  const form = useForm<ProjetoSchemaType>({
    resolver: zodResolver(ProjetoSchema),
    defaultValues: projeto || {
      tipo: 'PESQUISA',
      status: 'ATIVO',
      dataInicio: new Date(),
      coordenadorId: '',
    },
  })

  const { register, handleSubmit, formState, watch, setValue } = form

  const onSubmit = async (data: ProjetoSchemaType) => {
    try {
      if (projeto?.id) {
        await updateProjeto(projeto.id, data)
        toast.success('Projeto atualizado com sucesso!')
      } else {
        await postProjeto(data)
        toast.success('Projeto cadastrado com sucesso!')
      }
      onSuccess()
    } catch (error) {
      toast.error(formatErrorMessage(error))
    }
  }

  const renderError = (field: keyof ProjetoSchemaType) =>
    formState.errors[field] && (
      <span className="text-red-500 text-xs mt-1 block">
        {formState.errors[field]?.message}
      </span>
    )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="titulo">Título*</Label>
          <Input {...register('titulo')} />
          {renderError('titulo')}
        </div>
        <div className="space-y-2 relative">
          <Label htmlFor="url">URL*</Label>

          <span className="absolute top-8/15 left-3 text-sm text-muted-foreground">
            vitrine.ifalmenara.com.br/projeto/
          </span>

          <Input
            {...register('url')}
            id="url"
            placeholder=""
            className="pl-[227px]"
          />

          {renderError('url')}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Descrição*</Label>
        <Textarea rows={4} {...register('descricao')} />
        {renderError('descricao')}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tipo*</Label>
          <Select
            value={watch('tipo')}
            onValueChange={(val: ProjetoSchemaType['tipo']) =>
              setValue('tipo', val as ProjetoSchemaType['tipo'])
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PESQUISA">Pesquisa</SelectItem>
              <SelectItem value="ENSINO">Ensino</SelectItem>
              <SelectItem value="EXTENSAO">Extensão</SelectItem>
            </SelectContent>
          </Select>
          {renderError('tipo')}
        </div>
        <div className="space-y-2">
          <Label>Status*</Label>
          <Select
            value={watch('status')}
            onValueChange={(val: ProjetoSchemaType['status']) =>
              setValue('status', val as ProjetoSchemaType['status'])
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ATIVO">Ativo</SelectItem>
              <SelectItem value="CONCLUIDO">Concluído</SelectItem>
              <SelectItem value="PAUSADO">Pausado</SelectItem>
              <SelectItem value="CANCELADO">Cancelado</SelectItem>
            </SelectContent>
          </Select>
          {renderError('status')}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Data de Início*</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full h-10 justify-start text-left text-sm',
                  !watch('dataInicio') && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {watch('dataInicio')
                  ? format(watch('dataInicio'), 'dd/MM/yyyy')
                  : 'Selecione a data'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                required
                selected={watch('dataInicio')}
                onSelect={(date: Date) =>
                  setValue('dataInicio', date || new Date())
                }
              />
            </PopoverContent>
          </Popover>
          {renderError('dataInicio')}
        </div>

        <div className="space-y-2">
          <Label>Data de Fim (opcional)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full h-10 justify-start text-left text-sm',
                  !watch('dataFim') && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {watch('dataFim')
                  ? format(watch('dataFim')!, 'dd/MM/yyyy')
                  : 'Selecione a data'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                required
                selected={watch('dataFim')}
                onSelect={(date: Date) =>
                  setValue('dataFim', date || undefined)
                }
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Coordenador*</Label>
        <Select
          value={watch('coordenadorId')}
          onValueChange={(val: string) => setValue('coordenadorId', val)}
        >
          <SelectTrigger>
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

      <Button
        type="submit"
        disabled={formState.isSubmitting}
        className="w-full md:w-auto"
      >
        {formState.isSubmitting
          ? 'Salvando...'
          : projeto
          ? 'Atualizar Projeto'
          : 'Cadastrar Projeto'}
      </Button>
    </form>
  )
}
