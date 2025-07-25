import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

const loginHandler = async (
  app: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { email, senha } = loginSchema.parse(request.body)

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user || !(await bcrypt.compare(senha, user.senha))) {
    return reply.status(401).send({ error: 'Credenciais inválidas' })
  }

  const token = app.jwt.sign(
    {
      id: user.id,
      nome: user.nome,
      email: user.email,
      role: user.role,
    },
    { expiresIn: '30m' }
  )

  return reply.send({ token })
}

const meHandler = (request: FastifyRequest, reply: FastifyReply) => {
  return reply.send(request.user)
}

export { loginHandler, meHandler }
