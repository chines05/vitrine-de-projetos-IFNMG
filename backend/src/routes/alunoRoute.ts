import { FastifyInstance } from 'fastify'
import { authenticate } from '../middleware/auth'
import {
  createAlunoHandler,
  deleteAlunoHandler,
  getAlunosHandler,
  importAlunosHandler,
  updateAlunoHandler,
} from '../controllers/alunoController'

export async function alunoRoutes(app: FastifyInstance) {
  app.post('/api/alunos', { preHandler: [authenticate] }, createAlunoHandler)
  app.post(
    '/api/alunos/lote',
    { preHandler: [authenticate] },
    importAlunosHandler
  )
  app.get('/api/alunos', { preHandler: [authenticate] }, getAlunosHandler)
  app.put('/api/alunos/:id', { preHandler: [authenticate] }, updateAlunoHandler)
  app.delete(
    '/api/alunos/:id',
    { preHandler: [authenticate] },
    deleteAlunoHandler
  )
}
