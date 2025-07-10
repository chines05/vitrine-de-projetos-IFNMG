import { FastifyInstance } from 'fastify'
import { authRoutes } from './auth.js'
import { projectRoutes } from './projects.js'
import { coordenadorRoutes } from './coordenadores.js'
import { participanteRoutes } from './participantes.js'

export async function appRoutes(app: FastifyInstance) {
  // Auth Routes
  await app.register(authRoutes)

  // Project Routes
  await app.register(projectRoutes)

  // Coordenador Routes
  await app.register(coordenadorRoutes)

  // Participante Routes
  await app.register(participanteRoutes)
}
