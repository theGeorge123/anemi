"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, X } from 'lucide-react'
import { ErrorInfo } from '@/lib/error-service'

interface ErrorDisplayProps {
  error: ErrorInfo
  onRetry?: () => void | Promise<void>
  onDismiss?: () => void
  showDismiss?: boolean
  className?: string
}

export function ErrorDisplay({ 
  error, 
  onRetry, 
  onDismiss, 
  showDismiss = true,
  className = ""
}: ErrorDisplayProps) {
  const getErrorStyles = () => {
    switch (error.type) {
      case 'network':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'server':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'auth':
        return 'bg-blue-50 border-blue-200 text-blue-800'
      case 'validation':
        return 'bg-orange-50 border-orange-200 text-orange-800'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  const getErrorIcon = () => {
    switch (error.type) {
      case 'network':
        return '🌐'
      case 'server':
        return '🖥️'
      case 'auth':
        return '🔐'
      case 'validation':
        return '📝'
      default:
        return '❓'
    }
  }

  const getErrorTitle = () => {
    switch (error.type) {
      case 'network':
        return 'Netwerk Probleem'
      case 'server':
        return 'Server Probleem'
      case 'auth':
        return 'Authenticatie Probleem'
      case 'validation':
        return 'Validatie Probleem'
      default:
        return 'Onbekend Probleem'
    }
  }

  return (
    <div className={`p-4 rounded-lg border ${getErrorStyles()} ${className}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <span className="text-lg">{getErrorIcon()}</span>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium mb-1">
              {getErrorTitle()}
            </h4>
            
            {showDismiss && onDismiss && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDismiss}
                className="h-6 w-6 p-0 hover:bg-black/10"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
          
          <p className="text-sm mb-3">
            {error.message}
          </p>
          
          {error.retryable && onRetry && (
            <Button
              size="sm"
              onClick={onRetry}
              className="bg-current text-white hover:opacity-80"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Opnieuw Proberen
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// Inline error display for forms
export function InlineError({ error }: { error: ErrorInfo }) {
  return (
    <div className="p-3 rounded-md border bg-red-50 border-red-200 text-red-800 text-sm">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
        <span>{error.message}</span>
      </div>
    </div>
  )
}

// Toast-style error display
export function ToastError({ error, onDismiss }: { error: ErrorInfo; onDismiss?: () => void }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className={`p-4 rounded-lg shadow-lg border ${getErrorStyles()}`}>
        <div className="flex items-start gap-3">
          <span className="text-lg">{getErrorIcon()}</span>
          <div className="flex-1">
            <h4 className="text-sm font-medium mb-1">
              {getErrorTitle()}
            </h4>
            <p className="text-sm">{error.message}</p>
          </div>
          {onDismiss && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="h-6 w-6 p-0 hover:bg-black/10"
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// Helper function for consistent error styling
function getErrorStyles() {
  return 'bg-red-50 border-red-200 text-red-800'
}

function getErrorIcon() {
  return '❌'
}

function getErrorTitle() {
  return 'Fout'
} 