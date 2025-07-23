import { isAxiosError, type AxiosError } from 'axios'
import type { ErrorResponseType } from './types'

export function formatErrorMessage(
  err: AxiosError<ErrorResponseType> | unknown,
  fallback: string = 'Ocorreu um erro inesperado.'
): string {
  if (isAxiosError<ErrorResponseType>(err)) {
    const res = err.response?.data

    if (typeof res === 'string') return res

    // Se backend enviou objeto com campo `error`
    if (res && typeof res === 'object' && 'error' in res) {
      const apiError = res as { error?: string }
      if (apiError.error && typeof apiError.error === 'string') {
        return apiError.error
      }
    }

    if (res && typeof res === 'object' && 'message' in res) {
      const apiError = res as { message?: string }
      if (apiError.message && typeof apiError.message === 'string') {
        return apiError.message
      }
    }
  }

  if (err instanceof Error) return err.message

  return fallback
}

export const turmasPermitidas = [
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

export const cursosPermitidos = [
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
