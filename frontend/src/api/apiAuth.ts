import api from '@/utils/api'

export const login = async (email: string, password: string) => {
  const response = await api.post('/login', { email, password })
  localStorage.setItem('token', response.data.token)

  return response.data.user
}

export const getCurrentUser = async () => {
  const response = await api.get('/me')

  return response.data
}

export const logout = () => {
  localStorage.removeItem('token')
}
