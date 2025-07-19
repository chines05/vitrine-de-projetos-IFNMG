// src/types.d.ts
import '@fastify/jwt'

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      id: string
      nome: string
      email: string
      role: 'ADMIN' | 'COORDENADOR'
    }
    user: {
      id: string
      nome: string
      email: string
      role: 'ADMIN' | 'COORDENADOR'
    }
  }
}
