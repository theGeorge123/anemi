"use client"

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Home, RefreshCw, AlertTriangle, Wifi, Server, Bug, X } from 'lucide-react'
import Link from 'next/link'
import { errorService, ErrorInfo } from '@/lib/error-service'

interface GlobalErrorHandlerProps {
  children: React.ReactNode
}

export function GlobalErrorHandler({ children }: GlobalErrorHandlerProps) {
  const [error, setError] = useState<ErrorInfo | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const unsubscribe = errorService.onError((errorInfo) => {
      setError(errorInfo)
      setIsVisible(true)
    })

    return unsubscribe
  }, [])

  const handleRetry = () => {
    setIsVisible(false)
    setError(null)
    // Reload the page or retry the operation
    window.location.reload()
  }

  const handleDismiss = () => {
    setIsVisible(false)
    setError(null)
  }

  const handleGoHome = () => {
    window.location.href = '/'
  }

  if (!isVisible || !error) {
    return <>{children}</>
  }

  const getErrorIcon = () => {
    switch (error.type) {
      case 'network':
        return <Wifi className="w-10 h-10 text-red-600" />
      case 'server':
        return <Server className="w-10 h-10 text-red-600" />
      case 'auth':
        return <AlertTriangle className="w-10 h-10 text-red-600" />
      default:
        return <Bug className="w-10 h-10 text-red-600" />
    }
  }

  const getErrorTitle = () => {
    switch (error.type) {
      case 'network':
        return '🌐 Netwerkfout'
      case 'server':
        return '⚡ Serverfout'
      case 'auth':
        return '🔐 Authenticatiefout'
      case 'validation':
        return '📝 Validatiefout'
      default:
        return '🚨 Er ging iets mis'
    }
  }

  const getTroubleshootingTips = () => {
    switch (error.type) {
      case 'network':
        return [
          { title: '📶 Controleer Internet', description: 'Zorg dat je wifi of mobiele data aan staat' },
          { title: '🔄 Herstart App', description: 'Sluit en open de app opnieuw' }
        ]
      case 'server':
        return [
          { title: '⏰ Probeer Later', description: 'Onze servers zijn mogelijk overbelast' },
          { title: '📧 Contact Support', description: 'Neem contact op als het probleem aanhoudt' }
        ]
      case 'auth':
        return [
          { title: '🔑 Log Opnieuw In', description: 'Je sessie is verlopen' },
          { title: '📧 Contact Support', description: 'Neem contact op bij problemen' }
        ]
      default:
        return [
          { title: '🔄 Ververs Pagina', description: 'Druk F5 of gebruik Ctrl+R' },
          { title: '🧹 Cache Wissen', description: 'Wis browser cache en cookies' }
        ]
    }
  }

  return (
    <>
      {children}
      
      {/* Error Modal */}
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <CardHeader className="text-center relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="absolute top-2 right-2"
            >
              <X className="w-4 h-4" />
            </Button>
            
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {getErrorIcon()}
            </div>
            
            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
              {getErrorTitle()}
            </CardTitle>
            
            <CardDescription className="text-lg text-gray-600">
              {error.message}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Troubleshooting */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">🔧 Probleem Oplossen</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {getTroubleshootingTips().map((tip, index) => (
                  <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="font-medium text-blue-800 mb-1">{tip.title}</h4>
                    <p className="text-sm text-blue-700">{tip.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">⚡ Snelle Acties</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                {error.retryable && (
                  <Button 
                    onClick={handleRetry}
                    className="flex-1 bg-amber-600 hover:bg-amber-700"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Opnieuw Proberen
                  </Button>
                )}
                
                <Button 
                  onClick={handleGoHome}
                  variant="outline" 
                  className="flex-1"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Terug naar Home
                </Button>
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

            {/* Error Details */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Error Type: {error.type}</p>
                  {error.code && (
                    <p className="text-xs text-gray-500">Code: {error.code}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    {error.timestamp.toLocaleString('nl-NL')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    Retryable: {error.retryable ? 'Ja' : 'Nee'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
} 