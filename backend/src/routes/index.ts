import { FastifyInstance } from 'fastify'
import { authRoutes } from './auth.js'
import { userRoutes } from './users.js'
import { alunoRoutes } from './aluno.js'

export async function appRoutes(app: FastifyInstance) {
  await app.register(authRoutes)

  await app.register(userRoutes)

  await app.register(alunoRoutes)
}
