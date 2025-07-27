// Global error service for handling network failures and other errors
import React from 'react'

export interface ErrorInfo {
  type: 'network' | 'server' | 'auth' | 'validation' | 'unknown'
  message: string
  code?: string
  retryable: boolean
  timestamp: Date
}

export class ErrorService {
  private static instance: ErrorService
  private errorHandlers: ((error: ErrorInfo) => void)[] = []

  static getInstance(): ErrorService {
    if (!ErrorService.instance) {
      ErrorService.instance = new ErrorService()
    }
    return ErrorService.instance
  }

  // Register error handler
  onError(handler: (error: ErrorInfo) => void): () => void {
    this.errorHandlers.push(handler)
    return () => {
      const index = this.errorHandlers.indexOf(handler)
      if (index > -1) {
        this.errorHandlers.splice(index, 1)
      }
    }
  }

  // Handle network errors
  handleNetworkError(error: Error): ErrorInfo {
    const errorInfo: ErrorInfo = {
      type: 'network',
      message: 'Er is een probleem met je internetverbinding. Controleer je wifi of mobiele data.',
      code: 'NETWORK_ERROR',
      retryable: true,
      timestamp: new Date()
    }

    this.notifyHandlers(errorInfo)
    return errorInfo
  }

  // Handle server errors
  handleServerError(error: Error): ErrorInfo {
    const errorInfo: ErrorInfo = {
      type: 'server',
      message: 'Er is een probleem met onze servers. We werken eraan om dit op te lossen.',
      code: 'SERVER_ERROR',
      retryable: true,
      timestamp: new Date()
    }

    this.notifyHandlers(errorInfo)
    return errorInfo
  }

  // Handle authentication errors
  handleAuthError(error: Error): ErrorInfo {
    const errorInfo: ErrorInfo = {
      type: 'auth',
      message: 'Je sessie is verlopen. Log opnieuw in om door te gaan.',
      code: 'AUTH_ERROR',
      retryable: false,
      timestamp: new Date()
    }

    this.notifyHandlers(errorInfo)
    return errorInfo
  }

  // Handle validation errors
  handleValidationError(error: Error): ErrorInfo {
    const errorInfo: ErrorInfo = {
      type: 'validation',
      message: 'Er is een probleem met de ingevoerde gegevens. Controleer je input en probeer opnieuw.',
      code: 'VALIDATION_ERROR',
      retryable: false,
      timestamp: new Date()
    }

    this.notifyHandlers(errorInfo)
    return errorInfo
  }

  // Handle unknown errors
  handleUnknownError(error: Error): ErrorInfo {
    const errorInfo: ErrorInfo = {
      type: 'unknown',
      message: 'Er is een onverwachte fout opgetreden. Probeer het opnieuw.',
      code: 'UNKNOWN_ERROR',
      retryable: true,
      timestamp: new Date()
    }

    this.notifyHandlers(errorInfo)
    return errorInfo
  }

  // Auto-detect error type and handle
  handleError(error: Error): ErrorInfo {
    const message = error.message.toLowerCase()
    
    if (this.isNetworkError(error)) {
      return this.handleNetworkError(error)
    }
    
    if (this.isServerError(error)) {
      return this.handleServerError(error)
    }
    
    if (this.isAuthError(error)) {
      return this.handleAuthError(error)
    }
    
    if (this.isValidationError(error)) {
      return this.handleValidationError(error)
    }
    
    return this.handleUnknownError(error)
  }

  // Error type detection
  isNetworkError(error: Error): boolean {
    const message = error.message.toLowerCase()
    return message.includes('fetch') || 
           message.includes('network') ||
           message.includes('failed to fetch') ||
           message.includes('networkerror') ||
           message.includes('err_network') ||
           message.includes('connection') ||
           message.includes('timeout')
  }

  isServerError(error: Error): boolean {
    const message = error.message.toLowerCase()
    return message.includes('500') ||
           message.includes('internal server error') ||
           message.includes('server error') ||
           message.includes('service unavailable') ||
           message.includes('gateway timeout')
  }

  isAuthError(error: Error): boolean {
    const message = error.message.toLowerCase()
    return message.includes('401') ||
           message.includes('unauthorized') ||
           message.includes('forbidden') ||
           message.includes('authentication') ||
           message.includes('token') ||
           message.includes('session')
  }

  isValidationError(error: Error): boolean {
    const message = error.message.toLowerCase()
    return message.includes('validation') ||
           message.includes('invalid') ||
           message.includes('required') ||
           message.includes('format') ||
           message.includes('400')
  }

  // Notify all registered handlers
  private notifyHandlers(errorInfo: ErrorInfo): void {
    this.errorHandlers.forEach(handler => {
      try {
        handler(errorInfo)
      } catch (handlerError) {
        console.error('Error in error handler:', handlerError)
      }
    })
  }

  // Get user-friendly error message
  getUserFriendlyMessage(error: Error): string {
    const errorInfo = this.handleError(error)
    return errorInfo.message
  }

  // Check if error is retryable
  isRetryable(error: Error): boolean {
    const errorInfo = this.handleError(error)
    return errorInfo.retryable
  }

  // Get error type
  getErrorType(error: Error): ErrorInfo['type'] {
    const errorInfo = this.handleError(error)
    return errorInfo.type
  }
}

// Global error service instance
export const errorService = ErrorService.getInstance()

// Utility functions
export function isNetworkError(error: Error): boolean {
  return errorService.isNetworkError(error)
}

export function isServerError(error: Error): boolean {
  return errorService.isServerError(error)
}

export function isAuthError(error: Error): boolean {
  return errorService.isAuthError(error)
}

export function isValidationError(error: Error): boolean {
  return errorService.isValidationError(error)
}

export function getUserFriendlyMessage(error: Error): string {
  return errorService.getUserFriendlyMessage(error)
}

export function isRetryable(error: Error): boolean {
  return errorService.isRetryable(error)
}

// React hook for error handling
export function useErrorService() {
  const [currentError, setCurrentError] = React.useState<ErrorInfo | null>(null)

  React.useEffect(() => {
    const unsubscribe = errorService.onError((errorInfo) => {
      setCurrentError(errorInfo)
    })

    return unsubscribe
  }, [])

  const handleError = React.useCallback((error: Error) => {
    const errorInfo = errorService.handleError(error)
    setCurrentError(errorInfo)
    return errorInfo
  }, [])

  const clearError = React.useCallback(() => {
    setCurrentError(null)
  }, [])

  return {
    error: currentError,
    handleError,
    clearError,
    isRetryable: currentError?.retryable ?? false
  }
} 