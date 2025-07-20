// src/schemas/userSchema.ts
import { z } from 'zod'

export const UserSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  role: z.enum(['ADMIN', 'COORDENADOR']),
  senha: z
    .string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
    .optional()
    .or(z.literal('')),
})

export type UserSchemaType = z.infer<typeof UserSchema>
