import type { UpdateSenhaSchemaType } from '@/schemas/updateSenhaSchema'
import api from '@/utils/api'
import type { User } from '@/utils/types'

const postUser = async (userData: {
  nome: string
  email: string
  senha: string
  role: 'ADMIN' | 'COORDENADOR'
}) => {
  const response = await api.post('/users', userData)

  return response.data
}

const postUsersLote = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await api.post('/users/lote', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}

const getUsers = async () => {
  const response = await api.get<User[]>('/users')

  return response.data
}

const getCoordenadores = async () => {
  const response = await api.get<User[]>('/users/coordenadores')

  return response.data
}

const updateUser = async (
  id: string,
  userData: {
    nome?: string
    email?: string
    senha?: string
    role?: 'ADMIN' | 'COORDENADOR'
  }
) => {
  const response = await api.put(`/users/${id}`, userData)

  return response.data
}

const updateSenhaUser = async (id: string, data: UpdateSenhaSchemaType) => {
  const response = await api.patch(`/users/${id}/senha`, data)

  return response.data
}

const deleteUser = async (id: string) => {
  await api.delete(`/users/${id}`)

  return id
}

export {
  postUser,
  postUsersLote,
  getUsers,
  getCoordenadores,
  updateUser,
  updateSenhaUser,
  deleteUser,
}
