import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ProjetoSchema, type ProjetoSchemaType } from '@/schemas/projetoSchema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { getCoordenadores } from '@/api/apiUsers'
import toast from 'react-hot-toast'
import { formatErrorMessage } from '@/utils/format'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { postProjeto, updateProjeto } from '@/api/apiProjeto'
import type { User } from '@/utils/types'
import { useEffect, useState } from 'react'

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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Título*</Label>
          <Input {...register('titulo')} />
          {formState.errors.titulo && (
            <span className="text-red-500 text-xs">
              {formState.errors.titulo.message}
            </span>
          )}
        </div>

        <div>
          <Label>URL*</Label>
          <Input {...register('url')} />
          {formState.errors.url && (
            <span className="text-red-500 text-xs">
              {formState.errors.url.message}
            </span>
          )}
        </div>
      </div>

      <div>
        <Label>Descrição*</Label>
        <Textarea {...register('descricao')} rows={4} />
        {formState.errors.descricao && (
          <span className="text-red-500 text-xs">
            {formState.errors.descricao.message}
          </span>
        )}
      </div>

      <div>
        <Label>Resumo*</Label>
        <Textarea {...register('resumo')} rows={2} maxLength={200} />
        {formState.errors.resumo && (
          <span className="text-red-500 text-xs">
            {formState.errors.resumo.message}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Label>Tipo*</Label>
          <Select {...register('tipo')}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PESQUISA">Pesquisa</SelectItem>
              <SelectItem value="ENSINO">Ensino</SelectItem>
              <SelectItem value="EXTENSAO">Extensão</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Status*</Label>
          <Select {...register('status')}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ATIVO">Ativo</SelectItem>
              <SelectItem value="CONCLUIDO">Concluído</SelectItem>
              <SelectItem value="PAUSADO">Pausado</SelectItem>
              <SelectItem value="CANCELADO">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Data Início*</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !watch('dataInicio') && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {watch('dataInicio') ? (
                  format(watch('dataInicio'), 'PPP')
                ) : (
                  <span>Selecione uma data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={watch('dataInicio')}
                onSelect={(date) => setValue('dataInicio', date || new Date())}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label>Data Fim (opcional)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !watch('dataFim') && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {watch('dataFim') ? (
                  format(watch('dataFim') as Date, 'PPP')
                ) : (
                  <span>Selecione uma data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={watch('dataFim')}
                onSelect={(date) => setValue('dataFim', date || undefined)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Coordenador*</Label>
          <Select {...register('coordenadorId')}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {coordenadores?.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formState.errors.coordenadorId && (
            <span className="text-red-500 text-xs">
              {formState.errors.coordenadorId.message}
            </span>
          )}
        </div>
      </div>

      <Button type="submit" disabled={formState.isSubmitting}>
        {formState.isSubmitting ? 'Salvando...' : 'Salvar'}
      </Button>
    </form>
  )
}
