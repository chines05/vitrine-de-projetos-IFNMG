import { FastifyInstance } from 'fastify'
import { authenticate } from '../middleware/auth'
import {
  createTCCHandler,
  getAllTCCsHandler,
  getTCCByIdHandler,
  updateTCCHandler,
  deleteTCCHandler,
  downloadTCCHandler,
} from '../controllers/tccController'

export const tccRoutes = (app: FastifyInstance) => {
  app.post(
    '/api/tcc',
    {
      preHandler: [authenticate],
      config: {
        payload: {
          allow: 'multipart/form-data',
          multipart: true,
        },
      },
    },
    createTCCHandler
  )

  app.get('/api/tcc', getAllTCCsHandler)
  app.get('/api/tcc/:id', getTCCByIdHandler)
  app.get('/api/tcc/:id/download', downloadTCCHandler)
  app.put(
    '/api/tcc/:id',
    {
      preHandler: [authenticate],
      config: {
        payload: {
          allow: 'multipart/form-data',
          multipart: true,
          parse: true,
        },
      },
    },
    updateTCCHandler
  )
  app.delete('/api/tcc/:id', { preHandler: [authenticate] }, deleteTCCHandler)
}
