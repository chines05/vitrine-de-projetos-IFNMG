import '@fastify/jwt'

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      id: string
      nome: string
      email: string
      role: 'ADMIN' | 'COORDENADOR' | 'COORDENADOR_CURSO' | 'PROFESSOR'
      especializacao?: string | null // Adicione null aqui
    }
    user: {
      id: string
      nome: string
      email: string
      role: 'ADMIN' | 'COORDENADOR' | 'COORDENADOR_CURSO' | 'PROFESSOR'
      especializacao?: string | null // E aqui
    }
  }
}
