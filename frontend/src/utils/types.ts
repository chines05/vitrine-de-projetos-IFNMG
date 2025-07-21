export type User = {
  id: string
  nome: string
  email: string
  role: 'ADMIN' | 'COORDENADOR'
  createdAt?: string
  updatedAt?: string
  iat?: number
  exp?: number
}

export type Aluno = {
  id: string
  matricula: string
  nome: string
  email: string
  curso: string
  campus: string
  createdAt?: Date
  updatedAt?: Date
}

export type ProjetoType = {
  id: string
  titulo: string
  url: string
  descricao: string
  resumo: string
  dataInicio: Date
  dataFim?: Date
  tipo: 'PESQUISA' | 'ENSINO' | 'EXTENSAO'
  status: 'ATIVO' | 'CONCLUIDO'
  campus: string
  coordenadorId?: string
  createdAt?: Date
  updatedAt?: Date
}

export type ErrorResponseType =
  | string
  | {
      success: boolean
      message: string
      code: number
    }

export type MessageConversionObject = {
  defaultMessage: string
  [key: string]: string
}
