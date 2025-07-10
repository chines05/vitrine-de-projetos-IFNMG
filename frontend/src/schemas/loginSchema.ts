import z from 'zod'

export const LoginSchema = z.object({
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

  password: z
    .string()
    .min(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
    .max(50, { message: 'A senha deve ter no máximo 50 caracteres' }),
})

export type LoginSchemaType = z.infer<typeof LoginSchema>
