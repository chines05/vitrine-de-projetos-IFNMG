import { z } from 'zod'

export const AlunoSchema = z.object({
  id: z.string().uuid().optional(),
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  turma: z.string().min(4, 'Turma deve ter no mínimo 4 caracteres'),
  curso: z.string().min(2, 'Curso é obrigatório'),
})

export type AlunoSchemaType = z.infer<typeof AlunoSchema>
