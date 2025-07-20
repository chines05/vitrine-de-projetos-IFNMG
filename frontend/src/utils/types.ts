export type User = {
  id: string
  nome: string
  email: string
  role: 'ADMIN' | 'COORDENADOR'
  createdAt?: string
  updatedAt?: string
  iat?: number
  exp?: number
}
