import { z } from 'zod'

export const createUserSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  role: z.enum(['ADMIN', 'COORDENADOR']).default('COORDENADOR'),
})

export const updateUserSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID inválido'),
  }),
  body: z.object({
    nome: z.string().min(3).optional(),
    email: z.string().email().optional(),
    role: z.enum(['ADMIN', 'COORDENADOR']).optional(),
    senha: z.string().min(6).optional(),
  }),
})

export const updatePasswordSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID inválido'),
  }),
  body: z
    .object({
      senhaAtual: z.string().min(6),
      novaSenha: z.string().min(6),
      confirmarSenha: z.string().min(6),
    })
    .refine((data) => data.novaSenha === data.confirmarSenha, {
      message: 'As senhas não coincidem',
      path: ['confirmarSenha'],
    }),
})

export const deleteUserSchema = z.object({
  id: z.string().uuid('ID inválido'),
})
