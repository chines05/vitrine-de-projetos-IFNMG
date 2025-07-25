import fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { authenticate } from './middleware/auth'
import fastifyMultipart from '@fastify/multipart'
import { routes } from './routes'
import path from 'node:path'
import fastifyStatic from '@fastify/static'
import { fileURLToPath } from 'node:url'

const app = fastify()

await app.register(cors, {
  origin: ['http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
})

await app.register(jwt, {
  secret: 'secret-key-vitrine-projects-ifnmg-chines05',
})

const __dirname = path.dirname(fileURLToPath(import.meta.url))

await app.register(fastifyStatic, {
  root: path.join(__dirname, '..', 'uploads'),
  prefix: '/uploads/',
})

await app.register(fastifyMultipart, {
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
})

app.decorate('authenticate', authenticate)

await app.register(routes)

app.listen({ port: 8080, host: '0.0.0.0' }).then(() => {
  console.log('🚀 Servidor rodando em http://localhost:8080')
})
