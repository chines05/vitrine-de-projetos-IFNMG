import { FastifyInstance } from 'fastify'

export async function projectRoutes(app: FastifyInstance) {
  app.get('/projetos', async () => {
    return { projetos: [] }
  })
}
