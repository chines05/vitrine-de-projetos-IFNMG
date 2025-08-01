import type { ProjetoSchemaType } from '@/schemas/projetoSchema'
import api from '@/utils/api'
import type { ProjetoType, ProjetoParticipanteType } from '@/utils/types'

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

// Substitua as funções de aluno por participantes
const postProjetoParticipante = async (
  projetoId: string,
  participanteId: string,
  tipo: 'ALUNO' | 'SERVIDOR',
  funcao: string
) => {
  const response = await api.post(`/projetos/${projetoId}/participantes`, {
    tipo,
    participanteId,
    funcao,
  })
  return response.data as ProjetoParticipanteType
}

const deleteProjetoParticipante = async (
  projetoId: string,
  participanteId: string
) => {
  await api.delete(`/projetos/${projetoId}/participantes/${participanteId}`)
  return participanteId
}

// Mantenha as funções de imagens (não precisam ser alteradas)
const postProjetoImagem = async (
  projetoId: string,
  file: File,
  principal: boolean = false
) => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await api.post(
    `/projetos/${projetoId}/imagens?principal=${principal}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )
  return response.data
}

const patchImagemPrincipal = async (imagemId: string) => {
  const response = await api.patch(`/projetos/imagens/${imagemId}/principal`)
  return response.data
}

const deleteProjetoImagem = async (imagemId: string) => {
  const response = await api.delete(`/projetos/imagens/${imagemId}`)
  return response.data
}

export {
  postProjeto,
  getProjetos,
  getProjetoById,
  updateProjeto,
  deleteProjeto,
  postProjetoParticipante,
  deleteProjetoParticipante,
  postProjetoImagem,
  patchImagemPrincipal,
  deleteProjetoImagem,
}
