import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { authenticate, adminOnly } from '../middleware/auth'
import bcrypt from 'bcryptjs'
import { Prisma } from '@prisma/client'

export async function userRoutes(app: FastifyInstance) {
  app.post(
    '/api/users',
    { preHandler: [authenticate, adminOnly] },
    async (request, reply) => {
      const createUserSchema = z.object({
        nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
        email: z.string().email('E-mail inválido'),
        senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
        role: z.enum(['ADMIN', 'COORDENADOR']).default('COORDENADOR'),
      })

      const { nome, email, senha, role } = createUserSchema.parse(request.body)
      const hashedPassword = await bcrypt.hash(senha, 10)

      const userExists = await prisma.user.findUnique({
        where: { email },
      })

      if (userExists) {
        return reply.status(400).send({
          error: 'Já existe um usuário com este e-mail',
        })
      }

      const user = await prisma.user.create({
        data: {
          nome,
          email,
          senha: hashedPassword,
          role,
        },
      })

      return reply.status(201).send({
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      })
    }
  )

  app.get('/api/users', { preHandler: [authenticate, adminOnly] }, async () => {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return users
  })

  app.put(
    '/api/users/:id',
    { preHandler: [authenticate, adminOnly] },
    async (request, reply) => {
      const updateUserSchema = z.object({
        params: z.object({
          id: z.string().uuid('ID inválido'),
        }),
        body: z.object({
          nome: z
            .string()
            .min(3, 'Nome deve ter no mínimo 3 caracteres')
            .optional(),
          email: z.string().email('E-mail inválido').optional(),
          role: z.enum(['ADMIN', 'COORDENADOR']).optional(),
          senha: z
            .string()
            .min(6, 'Senha deve ter no mínimo 6 caracteres')
            .optional(),
        }),
      })

      const {
        params: { id },
        body: data,
      } = updateUserSchema.parse(request)

      const userExists = await prisma.user.findUnique({
        where: { id },
      })

      if (!userExists) {
        return reply.status(404).send({
          error: 'Usuário não encontrado',
        })
      }

      if (data.email && data.email !== userExists.email) {
        const emailInUse = await prisma.user.findUnique({
          where: { email: data.email },
        })

        if (emailInUse) {
          return reply.status(400).send({
            error: 'Já existe um usuário com este e-mail',
          })
        }
      }

      const updateData: any = {
        nome: data.nome,
        email: data.email,
        role: data.role,
      }

      if (data.senha) {
        updateData.senha = await bcrypt.hash(data.senha, 10)
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          nome: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      })

      return updatedUser
    }
  )

  app.patch(
    '/api/users/:id/senha',
    { preHandler: [authenticate] },
    async (request, reply) => {
      const updatePasswordSchema = z.object({
        params: z.object({
          id: z.string().uuid('ID inválido'),
        }),
        body: z
          .object({
            senhaAtual: z
              .string()
              .min(6, 'Senha atual deve ter no mínimo 6 caracteres'),
            novaSenha: z
              .string()
              .min(6, 'Nova senha deve ter no mínimo 6 caracteres'),
            confirmarSenha: z
              .string()
              .min(6, 'Confirmação deve ter no mínimo 6 caracteres'),
          })
          .refine((data) => data.novaSenha === data.confirmarSenha, {
            message: 'As senhas não coincidem',
            path: ['confirmarSenha'],
          }),
      })

      const {
        params: { id },
        body: { senhaAtual, novaSenha },
      } = updatePasswordSchema.parse(request)

      const user = await prisma.user.findUnique({
        where: { id },
      })

      if (!user) {
        return reply.status(404).send({
          error: 'Usuário não encontrado',
        })
      }

      const isPasswordValid = await bcrypt.compare(senhaAtual, user.senha)
      if (!isPasswordValid) {
        return reply.status(401).send({
          error: 'Senha atual incorreta',
        })
      }

      const isSamePassword = await bcrypt.compare(novaSenha, user.senha)
      if (isSamePassword) {
        return reply.status(400).send({
          error: 'A nova senha deve ser diferente da senha atual',
        })
      }

      const hashedPassword = await bcrypt.hash(novaSenha, 10)

      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          senha: hashedPassword,
        },
        select: {
          id: true,
          nome: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      })

      return reply.status(200).send(updatedUser)
    }
  )

  app.delete(
    '/api/users/:id',
    { preHandler: [authenticate, adminOnly] },
    async (request, reply) => {
      const deleteUserSchema = z.object({ id: z.string().uuid('ID inválido') })
      const { id } = deleteUserSchema.parse(request.params)

      const userExists = await prisma.user.findUnique({ where: { id } })

      if (!userExists) {
        return reply.status(404).send({ error: 'Usuário não encontrado' })
      }

      if (request.user.id === id) {
        return reply
          .status(400)
          .send({ error: 'Você não pode deletar seu próprio usuário' })
      }

      try {
        await prisma.user.delete({ where: { id } })
        return reply.status(204).send({ id })
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2003'
        ) {
          return reply.status(400).send({
            error:
              'Este usuário possui projetos vinculados e não pode ser deletado.',
          })
        }
        throw error
      }
    }
  )
}
