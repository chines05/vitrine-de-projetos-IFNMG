import { fastify } from 'fastify'
import cors from '@fastify/cors'
import { appRoutes } from './routes'

const app = fastify({ logger: true })

await app.register(cors, {
  origin: true,
})

await app.register(appRoutes)

app.listen({ port: 8080 }).then(() => {
  console.log('🚀 Server running on http://localhost:8080')
})
