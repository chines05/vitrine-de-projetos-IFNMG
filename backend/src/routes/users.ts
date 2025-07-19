import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { authenticate, adminOnly } from '../middleware/auth'
import bcrypt from 'bcryptjs'

export async function userRoutes(app: FastifyInstance) {
  // Apenas admin pode criar coordenadores
  app.post(
    '/users',
    { preHandler: [authenticate, adminOnly] },
    async (request, reply) => {
      const createUserSchema = z.object({
        nome: z.string().min(3),
        email: z.string().email(),
        senha: z.string().min(6),
      })

      const { nome, email, senha } = createUserSchema.parse(request.body)
      const hashedPassword = await bcrypt.hash(senha, 10)

      const user = await prisma.user.create({
        data: {
          nome,
          email,
          senha: hashedPassword,
          role: 'COORDENADOR',
        },
      })

      return reply.status(201).send({
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role,
      })
    }
  )

  // Listar usuários (apenas admin)
  app.get('/users', { preHandler: [authenticate, adminOnly] }, async () => {
    return prisma.user.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  })
}
