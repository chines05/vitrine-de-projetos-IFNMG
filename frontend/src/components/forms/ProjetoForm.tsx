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
import { useEffect, useMemo, useState } from 'react'
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
import type { UserType } from '@/utils/types'
import { getCurrentUser } from '@/api/apiAuth'

interface ProjetoFormProps {
  projeto?: ProjetoSchemaType | null
  onSuccess: () => void
}

export const ProjetoForm = ({ projeto, onSuccess }: ProjetoFormProps) => {
  const [coordenadores, setCoordenadores] = useState<UserType[]>([])
  const [me, setMe] = useState<UserType>()

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const data = await getCurrentUser()
        setMe(data)
      } catch (error) {
        toast.error(formatErrorMessage(error, 'Erro ao carregar usuário.'))
      }
    }

    fetchMe()
  }, [])

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
    defaultValues: {
      id: projeto?.id,
      titulo: projeto?.titulo || '',
      descricao: projeto?.descricao || '',
      coordenadorId: projeto?.coordenadorId || '',
      dataInicio: projeto?.dataInicio || new Date(),
      tipo: projeto?.tipo || 'PESQUISA',
      status: projeto?.status || 'ATIVO',
      dataFim: projeto?.dataFim || undefined,
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

  const tiposDisponiveis = useMemo(() => {
    const especializacaoParaTipo = {
      PESQUISA: 'PESQUISA',
      ENSINO: 'ENSINO',
      EXTENSAO: 'EXTENSAO',
      TECNOLOGO_EM_PROCESSOS_GERENCIAIS: 'ENSINO',
      TECNOLOGIA_EM_ANALISE_E_DESENVOLVIMENTO_DE_SISTEMAS: 'ENSINO',
      BACHARELADO_EM_ENGENHARIA_AGRONOMICA: 'ENSINO',
    }

    if (me?.role === 'ADMIN') {
      return ['PESQUISA', 'ENSINO', 'EXTENSAO']
    }

    if (me?.especializacao) {
      const tipoPermitido = especializacaoParaTipo[me.especializacao]
      return tipoPermitido ? [tipoPermitido] : []
    }

    return ['PESQUISA', 'ENSINO', 'EXTENSAO']
  }, [me?.especializacao, me?.role])

  useEffect(() => {
    if (tiposDisponiveis.length === 1 && !projeto?.id) {
      setValue(
        'tipo',
        tiposDisponiveis[0] as 'PESQUISA' | 'ENSINO' | 'EXTENSAO'
      )
    }
  }, [tiposDisponiveis, projeto?.id, setValue])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="titulo">Título*</Label>
        <Input {...register('titulo')} />
        {renderError('titulo')}
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
            disabled={tiposDisponiveis.length === 1 && !projeto?.id}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              {tiposDisponiveis.map((tipo) => (
                <SelectItem key={tipo} value={tipo}>
                  {tipo === 'PESQUISA'
                    ? 'Pesquisa'
                    : tipo === 'ENSINO'
                    ? 'Ensino'
                    : 'Extensão'}
                </SelectItem>
              ))}
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
