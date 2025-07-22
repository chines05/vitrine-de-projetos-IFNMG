import { FastifyInstance } from 'fastify'
import { authenticate, adminOnly } from '../middleware/auth'
import {
  createAlunoHandler,
  deleteAlunoHandler,
  getAlunosHandler,
  importAlunosHandler,
  updateAlunoHandler,
} from '../controllers/alunoController'

export async function alunoRoutes(app: FastifyInstance) {
  app.post(
    '/api/alunos',
    { preHandler: [authenticate, adminOnly] },
    createAlunoHandler
  )
  app.post(
    '/api/alunos/lote',
    { preHandler: [authenticate, adminOnly] },
    importAlunosHandler
  )
  app.get(
    '/api/alunos',
    { preHandler: [authenticate, adminOnly] },
    getAlunosHandler
  )
  app.put(
    '/api/alunos/:id',
    { preHandler: [authenticate, adminOnly] },
    updateAlunoHandler
  )
  app.delete(
    '/api/alunos/:id',
    { preHandler: [authenticate, adminOnly] },
    deleteAlunoHandler
  )
}
