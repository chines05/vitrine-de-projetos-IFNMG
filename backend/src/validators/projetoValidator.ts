import { z } from 'zod'

export const createProjetoSchema = z.object({
  titulo: z.string().min(3).max(100),
  descricao: z.string().min(10),
  dataInicio: z.string().datetime(),
  dataFim: z.string().datetime().optional(),
  tipo: z.enum(['PESQUISA', 'ENSINO', 'EXTENSAO']),
  status: z.enum(['ATIVO', 'CONCLUIDO', 'PAUSADO', 'CANCELADO']).optional(),
  coordenadorId: z.string().uuid(),
})

export const updateProjetoSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: createProjetoSchema.partial(),
})

export const deleteProjetoSchema = z.object({
  id: z.string().uuid(),
})

export const vincularParticipanteSchema = z.object({
  funcao: z.string().min(2),
  tipo: z.enum(['ALUNO', 'SERVIDOR']),
  participanteId: z.string().uuid(),
})

export type CreateProjetoSchemaType = z.infer<typeof createProjetoSchema>
export type UpdateProjetoSchemaType = z.infer<typeof updateProjetoSchema>
export type VincularParticipanteSchemaType = z.infer<
  typeof vincularParticipanteSchema
>
