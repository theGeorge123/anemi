"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'
import { errorService, ErrorInfo } from '@/lib/error-service'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; errorInfo: ErrorInfo }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null
    }
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Use ErrorService to handle the error
    const processedError = errorService.handleError(error)
    
    this.setState({
      error,
      errorInfo: processedError
    })
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error!} errorInfo={this.state.errorInfo!} />
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-red-700 mb-2">
                Oeps! Er ging iets mis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {this.state.errorInfo && (
                <div className={`p-4 rounded-lg border ${
                  this.state.errorInfo.type === 'network' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                  this.state.errorInfo.type === 'server' ? 'bg-red-50 border-red-200 text-red-800' :
                  this.state.errorInfo.type === 'auth' ? 'bg-blue-50 border-blue-200 text-blue-800' :
                  this.state.errorInfo.type === 'validation' ? 'bg-orange-50 border-orange-200 text-orange-800' :
                  'bg-gray-50 border-gray-200 text-gray-800'
                }`}>
                  <p className="text-sm font-medium mb-2">
                    {this.state.errorInfo.type === 'network' && '🌐 Netwerk Probleem'}
                    {this.state.errorInfo.type === 'server' && '🖥️ Server Probleem'}
                    {this.state.errorInfo.type === 'auth' && '🔐 Authenticatie Probleem'}
                    {this.state.errorInfo.type === 'validation' && '📝 Validatie Probleem'}
                    {this.state.errorInfo.type === 'unknown' && '❓ Onbekend Probleem'}
                  </p>
                  <p className="text-sm">
                    {this.state.errorInfo.message}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                {this.state.errorInfo?.retryable && (
                  <Button 
                    onClick={this.handleRetry}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Opnieuw Proberen
                  </Button>
                )}
                
                <Link href="/" className="flex-1">
                  <Button variant="outline" className="w-full">
                    <Home className="w-4 h-4 mr-2" />
                    Terug naar Home
                  </Button>
                </Link>
              </div>

              <div className="text-center text-xs text-gray-500">
                <p>Als het probleem aanhoudt, neem dan contact met ons op.</p>
                <Link href="/contact" className="text-amber-600 hover:underline">
                  Contact opnemen
                  </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

// Custom fallback component
export function ErrorFallback({ error, errorInfo }: { error: Error; errorInfo: ErrorInfo }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-700 mb-2">
            {errorInfo.type === 'network' && '🌐 Netwerk Probleem'}
            {errorInfo.type === 'server' && '🖥️ Server Probleem'}
            {errorInfo.type === 'auth' && '🔐 Authenticatie Probleem'}
            {errorInfo.type === 'validation' && '📝 Validatie Probleem'}
            {errorInfo.type === 'unknown' && '❓ Onbekend Probleem'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`p-4 rounded-lg border ${
            errorInfo.type === 'network' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
            errorInfo.type === 'server' ? 'bg-red-50 border-red-200 text-red-800' :
            errorInfo.type === 'auth' ? 'bg-blue-50 border-blue-200 text-blue-800' :
            errorInfo.type === 'validation' ? 'bg-orange-50 border-orange-200 text-orange-800' :
            'bg-gray-50 border-gray-200 text-gray-800'
          }`}>
            <p className="text-sm">
              {errorInfo.message}
            </p>
          </div>

          <div className="flex gap-3">
            {errorInfo.retryable && (
              <Button 
                onClick={() => window.location.reload()}
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Opnieuw Proberen
              </Button>
            )}
            
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full">
                <Home className="w-4 h-4 mr-2" />
                Terug naar Home
              </Button>
            </Link>
          </div>

          <div className="text-center text-xs text-gray-500">
            <p>Foutcode: {errorInfo.code}</p>
            <p>Timestamp: {errorInfo.timestamp.toLocaleString('nl-NL')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 