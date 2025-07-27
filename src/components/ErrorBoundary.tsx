"use client"

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Home, RefreshCw, AlertTriangle, Wifi, Server, Bug } from 'lucide-react'
import Link from 'next/link'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  isNetworkError: boolean
  isServerError: boolean
  retryCount: number
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isNetworkError: false,
      isServerError: false,
      retryCount: 0
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Determine error type
    const isNetworkError = error.message.includes('fetch') || 
                          error.message.includes('network') ||
                          error.message.includes('Failed to fetch') ||
                          error.message.includes('NetworkError') ||
                          error.message.includes('ERR_NETWORK')
    
    const isServerError = error.message.includes('500') ||
                         error.message.includes('Internal Server Error') ||
                         error.message.includes('server error')

    return {
      hasError: true,
      error,
      isNetworkError,
      isServerError
    }
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚨 Error Boundary caught an error:', error, errorInfo)
    
    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      // You could send to Sentry, LogRocket, etc.
      console.error('Production error:', {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack
      })
    }
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }))
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  override render() {
    if (this.state.hasError) {
      const { error, isNetworkError, isServerError, retryCount } = this.state

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {isNetworkError ? (
                  <Wifi className="w-10 h-10 text-red-600" />
                ) : isServerError ? (
                  <Server className="w-10 h-10 text-red-600" />
                ) : (
                  <Bug className="w-10 h-10 text-red-600" />
                )}
              </div>
              
              <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                {isNetworkError ? '🌐 Netwerkfout' : 
                 isServerError ? '⚡ Serverfout' : 
                 '🚨 Er ging iets mis'}
              </CardTitle>
              
              <CardDescription className="text-lg text-gray-600">
                {isNetworkError ? 
                  'Er is een probleem met je internetverbinding. Controleer je wifi of mobiele data.' :
                 isServerError ?
                  'Er is een probleem met onze servers. We werken eraan om dit op te lossen.' :
                  'Er is een onverwachte fout opgetreden. Probeer het opnieuw.'
                }
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Error Details */}
              {process.env.NODE_ENV === 'development' && error && (
                <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">🔍 Technische Details (Alleen in Development)</h4>
                  <p className="text-sm text-gray-700 mb-2">{error.message}</p>
                  {error.stack && (
                    <details className="text-xs text-gray-600">
                      <summary className="cursor-pointer hover:text-gray-800">Stack Trace</summary>
                      <pre className="mt-2 whitespace-pre-wrap">{error.stack}</pre>
                    </details>
                  )}
                </div>
              )}

              {/* Quick Actions */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">⚡ Snelle Acties</h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={this.handleRetry}
                    className="flex-1 bg-amber-600 hover:bg-amber-700"
                    disabled={retryCount >= 3}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    {retryCount >= 3 ? 'Te veel pogingen' : 'Opnieuw Proberen'}
                  </Button>
                  
                  <Button 
                    onClick={this.handleGoHome}
                    variant="outline" 
                    className="flex-1"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Terug naar Home
                  </Button>
                </div>
              </div>

              {/* Troubleshooting */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">🔧 Probleem Oplossen</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {isNetworkError ? (
                    <>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <h4 className="font-medium text-blue-800 mb-1">📶 Controleer Internet</h4>
                        <p className="text-sm text-blue-700">Zorg dat je wifi of mobiele data aan staat</p>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <h4 className="font-medium text-blue-800 mb-1">🔄 Herstart App</h4>
                        <p className="text-sm text-blue-700">Sluit en open de app opnieuw</p>
                      </div>
                    </>
                  ) : isServerError ? (
                    <>
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                        <h4 className="font-medium text-orange-800 mb-1">⏰ Probeer Later</h4>
                        <p className="text-sm text-orange-700">Onze servers zijn mogelijk overbelast</p>
                      </div>
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                        <h4 className="font-medium text-orange-800 mb-1">📧 Contact Support</h4>
                        <p className="text-sm text-orange-700">Neem contact op als het probleem aanhoudt</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                        <h4 className="font-medium text-purple-800 mb-1">🔄 Ververs Pagina</h4>
                        <p className="text-sm text-purple-700">Druk F5 of gebruik Ctrl+R</p>
                      </div>
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                        <h4 className="font-medium text-purple-800 mb-1">🧹 Cache Wissen</h4>
                        <p className="text-sm text-purple-700">Wis browser cache en cookies</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Help Links */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">📞 Hulp Nodig?</h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/contact" className="flex-1">
                    <Button variant="outline" className="w-full">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Contact Support
                    </Button>
                  </Link>
                  <Link href="/system-status" className="flex-1">
                    <Button variant="outline" className="w-full">
                      <Server className="w-4 h-4 mr-2" />
                      Systeem Status
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Status Info */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Poging {retryCount + 1} van 3</p>
                    <p className="text-xs text-gray-500">
                      {new Date().toLocaleString('nl-NL')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Error ID: {Math.random().toString(36).substr(2, 9)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook for functional components
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null)

  const handleError = React.useCallback((error: Error) => {
    console.error('🚨 Error caught by hook:', error)
    setError(error)
  }, [])

  const clearError = React.useCallback(() => {
    setError(null)
  }, [])

  return { error, handleError, clearError }
}

// Network error detection
export function isNetworkError(error: Error): boolean {
  return error.message.includes('fetch') || 
         error.message.includes('network') ||
         error.message.includes('Failed to fetch') ||
         error.message.includes('NetworkError') ||
         error.message.includes('ERR_NETWORK')
}

// Server error detection
export function isServerError(error: Error): boolean {
  return error.message.includes('500') ||
         error.message.includes('Internal Server Error') ||
         error.message.includes('server error')
} 