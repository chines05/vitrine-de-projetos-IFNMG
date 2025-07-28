export type UserType = {
  id: string
  nome: string
  email: string
  role: 'ADMIN' | 'COORDENADOR' | 'COORDENADOR_CURSO'
  createdAt?: string
  updatedAt?: string
  iat?: number
  exp?: number
}

export type AlunoType = {
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
  dataInicio: Date
  dataFim?: Date
  tipo: 'PESQUISA' | 'ENSINO' | 'EXTENSAO'
  status: 'ATIVO' | 'CONCLUIDO' | 'PAUSADO' | 'CANCELADO'
  createdAt: string
  updatedAt: string
  coordenador: UserType
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
  imagens: [
    {
      id: string
      url: string
      principal: boolean
      projetoId: string
      createdAt: string
    }
  ]
}

export type TccType = {
  id: string
  titulo: string
  curso: string
  resumo: string
  dataDefesa: Date
  file: string
  alunoId: string
  coordenadorId: string
  createdAt: string
  aluno: AlunoType
  coordenador: UserType
  orientador: string
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
