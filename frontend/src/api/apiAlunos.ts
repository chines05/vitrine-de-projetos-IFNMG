import type { AlunoSchemaType } from '@/schemas/alunoSchema'
import api from '@/utils/api'

const getAlunos = async () => {
  const response = await api.get('/alunos')

  return response.data
}

const postAluno = async (data: AlunoSchemaType) => {
  const response = await api.post('/alunos', data)

  return response.data
}

const postAlunosLote = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await api.post('/alunos/lote', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}

const updateAluno = async (id: string, data: AlunoSchemaType) => {
  const response = await api.put(`/alunos/${id}`, data)

  return response.data
}

const deleteAluno = async (id: string) => {
  const response = await api.delete(`/alunos/${id}`)

  return response.data
}

export { getAlunos, postAluno, postAlunosLote, updateAluno, deleteAluno }
