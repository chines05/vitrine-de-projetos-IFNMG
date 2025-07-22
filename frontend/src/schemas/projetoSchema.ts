import { z } from 'zod'

export const ProjetoSchema = z.object({
  id: z.string().uuid().optional(),
  titulo: z
    .string()
    .min(3, 'Título deve ter no mínimo 3 caracteres')
    .max(100, 'Título deve ter no máximo 100 caracteres'),

  url: z.string().min(3, 'URL é obrigatória').max(100).url('URL inválida'),
  descricao: z
    .string()
    .min(10, 'Descrição deve ter no mínimo 10 caracteres')
    .max(1000),
  resumo: z
    .string()
    .min(10, 'Resumo deve ter no mínimo 10 caracteres')
    .max(1000),
  tipo: z.enum(['PESQUISA', 'ENSINO', 'EXTENSAO'], {
    message: 'Tipo inválido',
  }),
  status: z.enum(['ATIVO', 'CONCLUIDO', 'PAUSADO', 'CANCELADO'], {
    message: 'Status inválido',
  }),
  coordenadorId: z.string().uuid('Coordenador inválido'),
  dataInicio: z
    .date()
    .refine((val) => val instanceof Date && !isNaN(val.getTime()), {
      message: 'Data de início é obrigatória',
    }),
  dataFim: z
    .date()
    .optional()
    .refine((val) => !val || val instanceof Date, {
      message: 'Data final inválida',
    }),
})

export type ProjetoSchemaType = z.infer<typeof ProjetoSchema>
