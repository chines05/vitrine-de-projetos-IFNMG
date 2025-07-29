import { FastifyInstance } from 'fastify'
import {
  createProjetoHandler,
  definirImagemPrincipalHandler,
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

export const projetosRoutes = (app: FastifyInstance) => {
  app.post(
    '/api/projetos',
    { preHandler: [authenticate] },
    createProjetoHandler
  )

  app.get('/api/projetos', getProjetosHandler)

  app.get('/api/projetos/:id', getProjetoHandler)

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
    '/api/projetos/:projetoId/imagens',
    {
      preHandler: [authenticate],
      config: {
        payload: {
          allow: 'multipart/form-data',
          multipart: true,
        },
      },
    },
    uploadImagemHandler
  )

  app.patch(
    '/api/projetos/imagens/:id/principal',
    { preHandler: [authenticate] },
    definirImagemPrincipalHandler
  )

  app.delete(
    '/api/projetos/imagens/:id',
    { preHandler: [authenticate] },
    removerImagemHandler
  )
}
