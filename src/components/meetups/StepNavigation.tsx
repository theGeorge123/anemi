"use client"

import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'

interface StepNavigationProps {
  currentStep: number
  totalSteps: number
  onNext: () => void
  onBack: () => void
  isNextDisabled?: boolean
  nextLabel?: string
}

export function StepNavigation({ 
  currentStep, 
  totalSteps, 
  onNext, 
  onBack, 
  isNextDisabled = false,
  nextLabel = 'Volgende'
}: StepNavigationProps) {
  return (
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
        className="flex items-center gap-1 sm:gap-2 bg-amber-600 hover:bg-amber-700 text-sm sm:text-base px-3 sm:px-4 py-2"
      >
        <span className="hidden sm:inline">{nextLabel}</span>
        <span className="sm:hidden">
          {currentStep === totalSteps ? '🎫' : '→'}
        </span>
        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 hidden sm:block" />
      </Button>
    </div>
  )
} 