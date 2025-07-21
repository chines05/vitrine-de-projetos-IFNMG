import z from 'zod'

export const updateSenhaSchema = z
  .object({
    senhaAtual: z
      .string()
      .min(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
      .max(50, { message: 'A senha deve ter no máximo 50 caracteres' }),
    novaSenha: z
      .string()
      .min(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
      .max(50, { message: 'A senha deve ter no máximo 50 caracteres' }),
    confirmarSenha: z
      .string()
      .min(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
      .max(50, { message: 'A senha deve ter no máximo 50 caracteres' }),
  })
  .refine((data) => data.novaSenha === data.confirmarSenha, {
    message: 'As senhas não coincidem',
    path: ['confirmarSenha'],
  })

export type UpdateSenhaSchemaType = z.infer<typeof updateSenhaSchema>
