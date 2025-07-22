import { z } from 'zod'

export const alunoSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  turma: z.string().min(4, 'Turma deve ter no mínimo 4 caracteres'),
  curso: z.string().min(2, 'Curso é obrigatório'),
})

export const updateAlunoSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID inválido'),
  }),
  body: alunoSchema.partial(),
})

export const deleteAlunoSchema = z.object({
  id: z.string().uuid('ID inválido'),
})
