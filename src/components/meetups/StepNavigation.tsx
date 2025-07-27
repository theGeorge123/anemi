"use client"

import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react'

interface StepNavigationProps {
  currentStep: number
  totalSteps: number
  onNext: () => void
  onBack: () => void
  isNextDisabled?: boolean
  nextLabel?: string
  validationMessage?: string
  isValid?: boolean
}

export function StepNavigation({ 
  currentStep, 
  totalSteps, 
  onNext, 
  onBack, 
  isNextDisabled = false,
  nextLabel = 'Volgende',
  validationMessage,
  isValid = true
}: StepNavigationProps) {
  return (
    <div className="space-y-4">
      {/* Validation Message */}
      {validationMessage && (
        <div className={`p-3 rounded-lg border ${
          isValid 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-amber-50 border-amber-200 text-amber-800'
        }`}>
          <div className="flex items-center gap-2">
            {isValid ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-600" />
            )}
            <span className="text-sm font-medium">{validationMessage}</span>
          </div>
        </div>
      )}
      
      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-4 sm:pt-6 gap-2 sm:gap-4">
        <Button
          onClick={onBack}
          disabled={currentStep === 1}
          variant="outline"
          className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base px-3 sm:px-4 py-2"
        >
          <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Terug</span>
          <span className="sm:hidden">←</span>
        </Button>
        
        <Button
          onClick={onNext}
          disabled={isNextDisabled}
          className={`flex items-center gap-1 sm:gap-2 text-sm sm:text-base px-3 sm:px-4 py-2 ${
            isNextDisabled 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-amber-600 hover:bg-amber-700'
          }`}
        >
          <span className="hidden sm:inline">{nextLabel}</span>
          <span className="sm:hidden">
            {currentStep === totalSteps ? '🎫' : '→'}
          </span>
          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 hidden sm:block" />
        </Button>
      </div>
    </div>
  )
} 