import { z } from 'zod'

export const createProjetoSchema = z.object({
  titulo: z.string().min(3).max(100),
  url: z.string().url(),
  descricao: z.string().min(10),
  resumo: z.string().min(10).max(200),
  dataInicio: z.string().datetime(),
  dataFim: z.string().datetime().optional(),
  tipo: z.enum(['PESQUISA', 'ENSINO', 'EXTENSAO']),
  status: z.enum(['ATIVO', 'CONCLUIDO', 'PAUSADO', 'CANCELADO']).optional(),
  campus: z.string().min(2),
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

export const vincularAlunoSchema = z.object({
  projetoId: z.string().uuid(),
  alunoId: z.string().uuid(),
  funcao: z.string().min(2),
})

export type CreateProjetoSchemaType = z.infer<typeof createProjetoSchema>
export type UpdateProjetoSchemaType = z.infer<typeof updateProjetoSchema>
export type VincularAlunoSchemaType = z.infer<typeof vincularAlunoSchema>
