import { z } from 'zod'

export const UserSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z
    .string()
    .min(1, { message: 'O e-mail é obrigatório' })
    .email({ message: 'E-mail inválido' })
    .max(100, { message: 'O e-mail deve ter no máximo 100 caracteres' })
    .refine(
      (email) => {
        const domain = email.split('@')[1]
        return domain && domain.endsWith('ifnmg.edu.br')
      },
      { message: 'Use seu e-mail institucional (@ifnmg.edu.br)' }
    ),
  role: z.enum(['ADMIN', 'COORDENADOR']),
  senha: z
    .string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
    .optional()
    .or(z.literal('')),
})

export type UserSchemaType = z.infer<typeof UserSchema>
