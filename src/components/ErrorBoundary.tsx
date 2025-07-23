"use client"

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle, RefreshCw, Home, Coffee } from 'lucide-react'
import Link from 'next/link'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console and any error reporting service
    console.error('🚨 Error Boundary caught an error:', error, errorInfo)
    
    // In production, you would send this to your error reporting service
    // Example: Sentry.captureException(error, { extra: errorInfo })
    
    this.setState({
      error,
      errorInfo
    })
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined as unknown as Error, errorInfo: undefined as unknown as ErrorInfo })
  }

  override render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full shadow-xl border-amber-200">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Oeps! Er ging iets mis ☕
              </h1>
              
              <p className="text-gray-600 mb-6">
                Er is een onverwachte fout opgetreden. Probeer de pagina te verversen of ga terug naar de homepage.
              </p>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mb-6 text-left">
                  <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 mb-2">
                    🔍 Debug informatie (alleen in development)
                  </summary>
                  <div className="bg-gray-100 p-3 rounded text-xs font-mono text-gray-700 overflow-auto max-h-32">
                    <div><strong>Error:</strong> {this.state.error.message}</div>
                    {this.state.errorInfo && (
                      <div><strong>Stack:</strong> {this.state.errorInfo.componentStack}</div>
                    )}
                  </div>
                </details>
              )}

              <div className="space-y-3">
                <Button
                  onClick={this.handleRetry}
                  className="w-full bg-amber-500 hover:bg-amber-600"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Probeer opnieuw
                </Button>
                
                <Button asChild variant="outline" className="w-full">
                  <Link href="/">
                    <Home className="w-4 h-4 mr-2" />
                    Terug naar Home
                  </Link>
                </Button>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Als het probleem aanhoudt, neem dan contact op met support
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook for functional components to catch errors
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('🚨 Unhandled error caught:', event.error)
      setError(event.error)
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('🚨 Unhandled promise rejection:', event.reason)
      setError(new Error(event.reason))
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  return error
}

// Global error handler component
export function GlobalErrorHandler({ children }: { children: ReactNode }) {
  const error = useErrorHandler()

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-xl border-red-200">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Coffee className="w-8 h-8 text-red-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Onverwachte fout ☕
            </h1>
            
            <p className="text-gray-600 mb-6">
              Er is een fout opgetreden. Ververs de pagina om door te gaan.
            </p>

            <Button
              onClick={() => window.location.reload()}
              className="w-full bg-amber-500 hover:bg-amber-600"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Pagina verversen
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
} 