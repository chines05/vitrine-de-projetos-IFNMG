import fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { appRoutes } from './routes'
import { authenticate } from './middleware/auth'

const app = fastify({ logger: true })

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: typeof authenticate
  }
}

await app.register(cors, {
  origin: ['http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
})

await app.register(jwt, {
  secret: 'secret-key-vitrine-projects-ifnmg-chines05',
})

app.decorate('authenticate', authenticate)

await app.register(appRoutes)

app.listen({ port: 8080, host: '0.0.0.0' }).then(() => {
  console.log('🚀 Servidor rodando em http://localhost:8080')
})
