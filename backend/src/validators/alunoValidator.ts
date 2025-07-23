import { z } from 'zod'

const turmasPermitidas = [
  'TLGE117NA',
  'TLAS124NA',
  'MSEN121NA',
  'MIAP125IA',
  'MIZO124IA',
  'BCEN125IA',
  'BCEN121IA',
  'TLGE124NA',
  'MIZO125IA',
  'MSEN123NB',
  'MIAP123IA',
  'TLGE119NA',
  'MIIN124IA',
  'TLGE120NA',
  'TLAS123NA',
  'MIAD124IA',
  'MSEN124NA',
  'MSEN125NA',
  'TLGE121NA',
  'MIAD125IA',
  'TLAS125NA',
  'BCEN122IA',
  'MIAG123IA',
  'MIIN125IA',
  'TLAS120NA',
  'MIAD123IA',
  'BCEN123IA',
  'MIZO123IA',
  'TLGE122NA',
  'BCEN119IA',
  'TLAS121NA',
  'BCEN124IA',
  'MIIN123IA',
  'TLAS118NA',
  'TLAS119NA',
  'TLAS122NA',
  'BCEN120IA',
  'BCEN118IA',
  'TLAS116NA',
]

const cursosPermitidos = [
  'Tecnólogo em Processos Gerenciais',
  'Tecnologia em Análise e Desenvolvimento de Sistemas',
  'Técnico em Enfermagem',
  'Técnico em Agropecuária Integrado ao Ensino Médio',
  'Técnico em Zootecnia Integrado ao Ensino Médio',
  'Bacharelado em Engenharia Agronômica',
  'Técnico em Administração Integrado ao Ensino Médio',
  'Técnico em Informática Integrado ao Ensino Médio',
  'Técnico em Agropecuária Integrado ao Ensino Médio em Regime de Alternância',
]

export const alunoSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  turma: z.enum(turmasPermitidas as [string, ...string[]], {
    message: 'Turma inválida para o campus IFNMG Almenara',
  }),
  curso: z.enum(cursosPermitidos as [string, ...string[]], {
    message: 'Curso inválido para o campus IFNMG Almenara',
  }),
})

export const updateAlunoSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID inválido'),
  }),
  body: alunoSchema.partial(),
})

export const deleteAlunoSchema = z.object({
  id: z.string().uuid('ID inválido'),
})
