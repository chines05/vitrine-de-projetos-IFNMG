import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { authenticate, adminOnly } from '../middleware/auth'
import bcrypt from 'bcryptjs'

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

  app.delete(
    '/api/users/:id',
    { preHandler: [authenticate, adminOnly] },
    async (request, reply) => {
      const deleteUserSchema = z.object({
        id: z.string().uuid('ID inválido'),
      })

      const { id } = deleteUserSchema.parse(request.params)

      const userExists = await prisma.user.findUnique({
        where: { id },
      })

      if (!userExists) {
        return reply.status(404).send({
          error: 'Usuário não encontrado',
        })
      }

      if (request.user.id === id) {
        return reply.status(400).send({
          error: 'Você não pode deletar seu próprio usuário',
        })
      }

      await prisma.user.delete({
        where: { id },
      })

      return reply.status(204).send({ id })
    }
  )
}
