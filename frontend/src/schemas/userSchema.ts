import { z } from 'zod'

export const EspecializacaoEnum = z.enum([
  'PESQUISA',
  'ENSINO',
  'EXTENSAO',
  'TECNOLOGO_EM_PROCESSOS_GERENCIAIS',
  'TECNOLOGIA_EM_ANALISE_E_DESENVOLVIMENTO_DE_SISTEMAS',
  'BACHARELADO_EM_ENGENHARIA_AGRONOMICA',
])

export const UserSchema = z
  .object({
    id: z.string().optional(),
    nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    email: z
      .string()
      .min(1, { message: 'O e-mail é obrigatório' })
      .email({ message: 'E-mail inválido' })
      .max(100, { message: 'O e-mail deve ter no máximo 100 caracteres' })
      .refine(
        (email) => {
          const domain = email.split('@')[1]
          return domain && domain.endsWith('ifnmg.edu.br')
        },
        { message: 'Use seu e-mail institucional (@ifnmg.edu.br)' }
      ),
    role: z.enum(['ADMIN', 'COORDENADOR', 'COORDENADOR_CURSO', 'PROFESSOR']),
    especializacao: EspecializacaoEnum.optional(),
    senha: z
      .union([
        z
          .string()
          .min(6, { message: 'A senha deve ter no mínimo 6 caracteres' }),
        z.literal(''),
        z.undefined(),
      ])
      .optional(),
  })
  .refine(
    (data) => {
      const isCadastro = !data.id
      const senha = data.senha ?? ''
      return !isCadastro || senha.length >= 6
    },
    {
      message:
        'A senha é obrigatória no cadastro e deve ter no mínimo 6 caracteres',
      path: ['senha'],
    }
  )

export type EspecializacaoType = z.infer<typeof EspecializacaoEnum>
export type UserSchemaType = z.infer<typeof UserSchema>
