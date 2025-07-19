import { FastifyRequest, FastifyReply } from 'fastify'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    await request.jwtVerify()
  } catch (err) {
    reply.status(401).send({ error: 'Não autorizado' })
  }
}

export function adminOnly(
  request: FastifyRequest,
  reply: FastifyReply,
  done: () => void
) {
  if (request.user?.role !== 'ADMIN') {
    reply.status(403).send({ error: 'Acesso restrito a administradores' })
    return
  }
  done()
}
