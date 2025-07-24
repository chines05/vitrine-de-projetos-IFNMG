import { FastifyInstance } from 'fastify'
import { authenticate } from '../middleware/auth'
import {
  createTCCHandler,
  getAllTCCsHandler,
  getTCCByIdHandler,
  updateTCCHandler,
  deleteTCCHandler,
} from '../controllers/tccController'

export const tccRoutes = (app: FastifyInstance) => {
  app.post(
    '/tcc',
    {
      preHandler: [authenticate],
    },
    createTCCHandler
  )
  app.get('/tcc', getAllTCCsHandler)
  app.get('/tcc/:id', getTCCByIdHandler)
  app.put('/tcc/:id', { preHandler: [authenticate] }, updateTCCHandler)
  app.delete('/tcc/:id', { preHandler: [authenticate] }, deleteTCCHandler)
}
