import { Especializacao } from '@prisma/client'
import { z } from 'zod'

export const createUserSchema = z.object({
  nome: z.string().min(3),
  email: z.string().email(),
  senha: z.string().min(6),
  role: z.enum(['ADMIN', 'COORDENADOR', 'COORDENADOR_CURSO', 'PROFESSOR']),
  especializacao: z.nativeEnum(Especializacao).optional(),
})

export const updateUserSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID inválido'),
  }),
  body: z.object({
    nome: z.string().min(3).optional(),
    email: z.string().email().optional(),
    senha: z.string().min(6).optional(),
    role: z
      .enum(['ADMIN', 'COORDENADOR', 'COORDENADOR_CURSO', 'PROFESSOR'])
      .optional(),
    especializacao: z.string().optional(),
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
