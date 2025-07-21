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
