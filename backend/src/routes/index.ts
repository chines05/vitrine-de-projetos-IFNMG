import { FastifyInstance } from 'fastify'
import { authRoutes } from './auth.js'

export async function appRoutes(app: FastifyInstance) {
  await app.register(authRoutes)
}
