import { FastifyInstance } from 'fastify'

export async function authRoutes(app: FastifyInstance) {
  app.post('/login', async (request, reply) => {
    return { message: 'Login route' }
  })
}
