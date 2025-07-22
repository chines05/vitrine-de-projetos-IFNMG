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
  nome: string
  turma: string
  curso: string
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
  status: 'ATIVO' | 'CONCLUIDO' | 'PAUSADO' | 'CANCELADO'
  campus: string
  createdAt: string
  updatedAt: string
  coordenador: User
  coordenadorId: string
  participantes: {
    id: string
    aluno: {
      id: string
      nome: string
      turma: string
      curso: string
    }
    alunoId: string
    funcao: string
    projetoId: string
    createdAt: string
  }[]
  imagens: {
    id: string
    url: string
    projetoId: string
    createdAt: string
  }[]
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
