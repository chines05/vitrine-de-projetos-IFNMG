import { FastifyInstance } from 'fastify'

export async function participanteRoutes(app: FastifyInstance) {
  app.get('/participantes', async () => {
    return { participantes: [] }
  })
}
