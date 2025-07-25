import { FastifyInstance } from 'fastify'
import { loginHandler, meHandler } from '../controllers/authController'
import { authenticate } from '../middleware/auth'

export async function authRoutes(app: FastifyInstance) {
  app.post('/api/login', async (request, reply) => {
    return loginHandler(app, request, reply)
  })

  app.get('/api/me', { preHandler: [authenticate] }, async (request, reply) => {
    return meHandler(request, reply)
  })
}
