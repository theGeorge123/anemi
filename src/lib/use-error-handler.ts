"use client"

import { useCallback } from 'react'
import { errorService, useErrorService } from '@/lib/error-service'

export function useErrorHandler() {
  const { error, handleError, clearError } = useErrorService()

  const handleAsyncError = useCallback(
    async <T>(asyncFn: () => Promise<T>, fallbackMessage = 'Er ging iets mis'): Promise<T | null> => {
      try {
        return await asyncFn()
      } catch (err) {
        const error = err instanceof Error ? err : new Error(fallbackMessage)
        handleError(error)
        return null
      }
    },
    [handleError]
  )

  const handleFetchError = useCallback(
    async <T>(response: Response, fallbackMessage = 'Er ging iets mis'): Promise<T | null> => {
      if (!response.ok) {
        try {
          const errorData = await response.json()
          const errorMessage = errorData.error || errorData.message || fallbackMessage
          throw new Error(errorMessage)
        } catch (parseError) {
          throw new Error(fallbackMessage)
        }
      }

      try {
        return await response.json()
      } catch (parseError) {
        throw new Error('Ongeldige server response')
      }
    },
    [handleError]
  )

  const handleValidationError = useCallback((message: string) => {
    const error = new Error(message)
    errorService.handleValidationError(error)
    handleError(error)
  }, [handleError])

  const handleNetworkError = useCallback((message?: string) => {
    const error = new Error(message || 'Netwerk probleem')
    errorService.handleNetworkError(error)
    handleError(error)
  }, [handleError])

  const handleServerError = useCallback((message?: string) => {
    const error = new Error(message || 'Server probleem')
    errorService.handleServerError(error)
    handleError(error)
  }, [handleError])

  const handleAuthError = useCallback((message?: string) => {
    const error = new Error(message || 'Authenticatie probleem')
    errorService.handleAuthError(error)
    handleError(error)
  }, [handleError])

  return {
    error,
    clearError,
    handleError,
    handleAsyncError,
    handleFetchError,
    handleValidationError,
    handleNetworkError,
    handleServerError,
    handleAuthError,
    isRetryable: error?.retryable ?? false
  }
} 