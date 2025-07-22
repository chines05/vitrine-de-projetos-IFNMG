import { FastifyInstance } from 'fastify'
import { loginHandler, meHandler } from '../controllers/authController'

export async function authRoutes(app: FastifyInstance) {
  app.post('/api/login', async (request, reply) => {
    return loginHandler(app, request, reply)
  })

  app.get(
    '/api/me',
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      return meHandler(request, reply)
    }
  )
}
