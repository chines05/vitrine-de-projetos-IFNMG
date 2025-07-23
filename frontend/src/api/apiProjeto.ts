import type { ProjetoSchemaType } from '@/schemas/projetoSchema'
import api from '@/utils/api'
import type { ProjetoType } from '@/utils/types'

const postProjeto = async (data: ProjetoSchemaType) => {
  const response = await api.post('/projetos', data)

  return response.data
}

const getProjetos = async () => {
  const response = await api.get<ProjetoType[]>('/projetos')

  return response.data
}

const getProjetoById = async (id: string) => {
  const response = await api.get<ProjetoType>(`/projetos/${id}`)

  return response.data
}

const updateProjeto = async (id: string, data: ProjetoSchemaType) => {
  const response = await api.put(`/projetos/${id}`, data)

  return response.data
}

const deleteProjeto = async (id: string) => {
  await api.delete(`/projetos/${id}`)

  return id
}

const postProjetoAluno = async (
  projetoId: string,
  alunoId: string,
  funcao: { funcao: string }
) => {
  const response = await api.post(
    `/projetos/${projetoId}/alunos/${alunoId}`,
    funcao
  )
  return response.data
}

const deleteProjetoAluno = async (projetoId: string, alunoId: string) => {
  const response = await api.delete(`/projetos/${projetoId}/alunos/${alunoId}`)

  return response.data
}

const postProjetoImagem = async (projetoId: string, formData: FormData) => {
  const response = await api.post(`/projetos/${projetoId}/imagens`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

const deleteProjetoImagem = async (imagemId: string) => {
  return await api.delete(`/projeto-imagem/${imagemId}`)
}

export {
  postProjeto,
  getProjetos,
  getProjetoById,
  updateProjeto,
  deleteProjeto,
  postProjetoAluno,
  deleteProjetoAluno,
  postProjetoImagem,
  deleteProjetoImagem,
}
