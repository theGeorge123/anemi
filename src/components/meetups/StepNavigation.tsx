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
    <div className="flex justify-between items-center pt-6">
      <Button
        onClick={onBack}
        disabled={currentStep === 1}
        variant="outline"
        className="flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Terug
      </Button>
      
      <Button
        onClick={onNext}
        disabled={isNextDisabled}
        className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700"
      >
        {nextLabel}
        <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  )
} 