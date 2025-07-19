export type User = {
  id: string
  nome: string
  email: string
  role: 'ADMIN' | 'COORDENADOR'
  iat: number
  exp: number
}
