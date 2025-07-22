import { FastifyInstance } from 'fastify'
import {
  createUserHandler,
  deleteUserHandler,
  getUsersHandler,
  importUsersHandler,
  updatePasswordHandler,
  updateUserHandler,
} from '../controllers/userController'
import { authenticate, adminOnly } from '../middleware/auth'

export async function userRoutes(app: FastifyInstance) {
  app.post(
    '/api/users',
    { preHandler: [authenticate, adminOnly] },
    createUserHandler
  )
  app.post(
    '/api/users/lote',
    { preHandler: [authenticate, adminOnly] },
    importUsersHandler
  )
  app.get('/api/users', { preHandler: [authenticate, adminOnly] }, async () =>
    getUsersHandler()
  )
  app.put(
    '/api/users/:id',
    { preHandler: [authenticate, adminOnly] },
    updateUserHandler
  )
  app.patch(
    '/api/users/:id/senha',
    { preHandler: [authenticate] },
    updatePasswordHandler
  )
  app.delete(
    '/api/users/:id',
    { preHandler: [authenticate, adminOnly] },
    deleteUserHandler
  )
}
