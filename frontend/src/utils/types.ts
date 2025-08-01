import type { EspecializacaoType } from '@/schemas/userSchema'

export type UserType = {
  id: string
  nome: string
  email: string
  role: 'ADMIN' | 'COORDENADOR' | 'COORDENADOR_CURSO' | 'PROFESSOR'
  especializacao?: EspecializacaoType
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
  descricao: string
  dataInicio: Date
  dataFim?: Date
  tipo: 'PESQUISA' | 'ENSINO' | 'EXTENSAO'
  status: 'ATIVO' | 'CONCLUIDO' | 'PAUSADO' | 'CANCELADO'
  createdAt: string
  updatedAt: string
  coordenador: UserType
  coordenadorId: string
  participantes: ProjetoParticipanteType[]
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

export type ProjetoParticipanteType = {
  id: string
  projetoId: string
  alunoId?: string
  userId?: string
  funcao: string
  tipo: 'ALUNO' | 'SERVIDOR'
  createdAt: string
  aluno?: {
    id: string
    nome: string
    turma: string
    curso?: string
  }
  user?: {
    id: string
    nome: string
    email: string
    role?: string
  }
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
