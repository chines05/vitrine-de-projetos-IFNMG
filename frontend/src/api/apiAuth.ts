import api from '@/utils/api'
import type { User } from '@/utils/types'

const login = async (email: string, senha: string) => {
  const response = await api.post('/login', { email, senha })
  localStorage.setItem('token', response.data.token)

  return response.data.user
}

const getCurrentUser = async () => {
  const response = await api.get<User>('/me')
  const user = response.data

  return user
}

const logout = () => {
  localStorage.removeItem('token')
}

export { login, getCurrentUser, logout }
