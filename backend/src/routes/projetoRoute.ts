import { FastifyInstance } from 'fastify'
import {
  createProjetoHandler,
  deleteProjetoHandler,
  desvincularAlunoHandler,
  getProjetoHandler,
  getProjetosHandler,
  removerImagemHandler,
  updateProjetoHandler,
  uploadImagemHandler,
  vincularAlunoHandler,
} from '../controllers/projetoController'
import { authenticate } from '../middleware/auth'

export async function projetosRoutes(app: FastifyInstance) {
  app.post(
    '/api/projetos',
    { preHandler: [authenticate] },
    createProjetoHandler
  )

  app.get('/api/projetos', getProjetosHandler)

  app.get(
    '/api/projetos/:id',
    { preHandler: [authenticate] },
    getProjetoHandler
  )

  app.put(
    '/api/projetos/:id',
    { preHandler: [authenticate] },
    updateProjetoHandler
  )

  app.delete(
    '/api/projetos/:id',
    { preHandler: [authenticate] },
    deleteProjetoHandler
  )

  app.post(
    '/api/projetos/:projetoId/alunos/:alunoId',
    { preHandler: [authenticate] },
    vincularAlunoHandler
  )

  app.delete(
    '/api/projetos/:projetoId/alunos/:alunoId',
    { preHandler: [authenticate] },
    desvincularAlunoHandler
  )

  app.post(
    '/api/projetos/:projetoId/imagem',
    {
      preHandler: [authenticate],
      config: {
        payload: {
          allow: 'multipart/form-data',
          multipart: true,
          maxFileSize: 5 * 1024 * 1024,
        },
      },
    },
    uploadImagemHandler
  )

  app.delete(
    '/api/projetos/imagem/:id',
    { preHandler: [authenticate] },
    removerImagemHandler
  )
}
