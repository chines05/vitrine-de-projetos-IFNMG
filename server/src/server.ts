import { fastify, FastifyReply, FastifyRequest } from 'fastify'

const app = fastify({
  logger: true,
})

app.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
  return { hello: 'world' }
})

app
  .listen({ port: 8080 })
  .then(() => {
    console.log('Server started on port 8080')
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
