import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'

export async function authRoutes(app: FastifyInstance) {
  app.post('/api/login', async (request, reply) => {
    const loginSchema = z.object({
      email: z.string().email('E-mail inválido'),
      password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
    })

    const { email, password } = loginSchema.parse(request.body)

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user || !(await bcrypt.compare(password, user.senha))) {
      return reply.status(401).send({
        error: 'Credenciais inválidas',
      })
    }

    const token = app.jwt.sign(
      {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role,
      },
      {
        expiresIn: '1h',
      }
    )

    return {
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role,
      },
    }
  })

  app.get('/api/me', { preHandler: [app.authenticate] }, async (request) => {
    return request.user
  })
}
