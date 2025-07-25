import type { TccType } from '@/utils/types'
import api from '@/utils/api'
import type { TccSchemaType } from '@/schemas/tccSchema'

const postTcc = async (data: TccSchemaType) => {
  const response = await api.post('/tcc', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}

const getTccs = async () => {
  const response = await api.get<TccType[]>('/tcc')

  return response.data
}

const getTccById = async (id: string) => {
  const response = await api.get<TccType>(`/tcc/${id}`)

  return response.data
}

const updateTcc = async (id: string, data: TccSchemaType) => {
  const response = await api.put(`/tcc/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}

const deleteTcc = async (id: string) => {
  await api.delete(`/tcc/${id}`)

  return id
}

const downloadTcc = async (id: string) => {
  const response = await api.get(`/api/tcc/${id}/download`, {
    responseType: 'blob',
  })

  return response
}

export { postTcc, getTccs, getTccById, updateTcc, deleteTcc, downloadTcc }
