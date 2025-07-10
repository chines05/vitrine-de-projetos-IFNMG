import { FastifyInstance } from 'fastify'

export async function coordenadorRoutes(app: FastifyInstance) {
  app.get('/coordenadores', async () => {
    return { coordenadores: [] }
  })
}
