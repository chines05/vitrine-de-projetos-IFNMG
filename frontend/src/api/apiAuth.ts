import api from '@/utils/api'
import type { User } from '@/utils/types'
import toast from 'react-hot-toast'

const login = async (email: string, senha: string) => {
  const response = await api.post('/login', { email, senha })
  localStorage.setItem('token', response.data.token)

  return response.data.user
}

const getCurrentUser = async () => {
  const response = await api.get<User>('/me')
  const user = response.data

  const now = Math.floor(Date.now() / 1000)
  if (user.exp && user.exp - now < 300) {
    toast.error('Token vai expirar em breve!')
  }

  return user
}

const logout = () => {
  localStorage.removeItem('token')
}

export { login, getCurrentUser, logout }
