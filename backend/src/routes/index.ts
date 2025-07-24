import { FastifyInstance } from 'fastify'
import { authRoutes } from './authRoute.js'
import { userRoutes } from './userRoute.js'
import { alunoRoutes } from './alunoRoute.js'
import { projetosRoutes } from './projetoRoute.js'
import { tccRoutes } from './tccRoute.js'

export async function routes(app: FastifyInstance) {
  await app.register(authRoutes)

  await app.register(userRoutes)

  await app.register(alunoRoutes)

  await app.register(projetosRoutes)

  await app.register(tccRoutes)
}
