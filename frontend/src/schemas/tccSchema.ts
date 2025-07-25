import { z } from 'zod'
import { cursosPermitidosTcc } from '@/utils/format'

export const tccSchema = z.object({
  titulo: z.string().min(3, 'Título muito curto'),
  curso: z.enum(cursosPermitidosTcc, {
    message: 'Curso inválido',
  }),
  resumo: z.string().min(50, 'Resumo deve ter pelo menos 50 caracteres'),
  dataDefesa: z.string().refine(
    (val) => {
      return !isNaN(Date.parse(val)) && val.match(/^\d{4}-\d{2}-\d{2}$/)
    },
    {
      message: 'Formato de data inválido. Use YYYY-MM-DD (ex: 2024-12-31)',
    }
  ),
  alunoId: z.string().uuid('ID do aluno inválido'),
  coordenadorId: z.string().uuid('ID do coordenador inválido'),
  orientador: z.string().min(3, 'Orientador inválido'),
  file: z
    .instanceof(File, { message: 'Arquivo PDF é obrigatório' })
    .refine((file) => file.size <= 5 * 1024 * 1024, 'Tamanho máximo de 5MB')
    .refine(
      (file) => file.type === 'application/pdf',
      'Apenas PDFs são permitidos'
    ),
})

export type TccSchemaType = z.infer<typeof tccSchema>
