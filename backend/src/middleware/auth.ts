import { FastifyRequest, FastifyReply } from 'fastify'

const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify()
  } catch (err) {
    reply.status(401).send({ error: 'Não autorizado' })
  }
}

const adminOnly = (
  request: FastifyRequest,
  reply: FastifyReply,
  done: () => void
) => {
  if (request.user?.role !== 'ADMIN') {
    reply.status(403).send({ error: 'Acesso restrito a administradores' })
    return
  }
  done()
}

export { authenticate, adminOnly }
