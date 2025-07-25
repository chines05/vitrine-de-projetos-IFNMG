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

const downloadTcc = async (id: string, fileName: string) => {
  const response = await api.get(`/tcc/${id}/download`, {
    responseType: 'blob',
  })

  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()

  window.URL.revokeObjectURL(url)
  link.remove()

  return response
}

export { postTcc, getTccs, getTccById, updateTcc, deleteTcc, downloadTcc }
