import { FastifyInstance } from 'fastify'
import { authRoutes } from './auth.js'
import { userRoutes } from './users.js'

export async function appRoutes(app: FastifyInstance) {
  await app.register(authRoutes)

  await app.register(userRoutes)
}
