"use client"

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  const getStepLabel = (stepNumber: number) => {
    switch (stepNumber) {
      case 1: return { label: 'Wie ben je?', emoji: '👋' }
      case 2: return { label: 'Waar?', emoji: '🌍' }
      case 3: return { label: 'Wanneer?', emoji: '📅' }
      case 4: 
        if (totalSteps >= 6) return { label: 'Tijden per datum', emoji: '🗓️' }
        return { label: 'Cafe?', emoji: '☕' }
      case 5:
        if (totalSteps >= 7) return { label: 'Cafe?', emoji: '☕' }
        if (totalSteps === 6) return { label: 'Cafe?', emoji: '☕' }
        return { label: 'Klaar!', emoji: '🎉' }
      case 6:
        if (totalSteps >= 8) return { label: 'Cafe selectie', emoji: '📋' }
        if (totalSteps === 7) return { label: 'Cafe selectie', emoji: '📋' }
        return { label: 'Klaar!', emoji: '🎉' }
      case 7:
        if (totalSteps === 8) return { label: 'Klaar!', emoji: '🎉' }
        return { label: 'Cafe selectie', emoji: '📋' }
      case 8: return { label: 'Klaar!', emoji: '🎉' }
      default: return { label: 'Stap', emoji: '📝' }
    }
  }

  const steps = Array.from({ length: totalSteps }, (_, i) => {
    const stepNumber = i + 1
    const { label, emoji } = getStepLabel(stepNumber)
    return { number: stepNumber, label, emoji }
  })

  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex items-center justify-between mb-4 px-2">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all ${
              step.number <= currentStep
                ? 'bg-amber-500 border-amber-500 text-white'
                : 'bg-background border-muted text-muted-foreground'
            }`}>
              <span className="text-xs sm:text-sm font-bold">{step.emoji}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-6 sm:w-10 h-1 mx-1 sm:mx-2 transition-all ${
                step.number < currentStep ? 'bg-amber-500' : 'bg-muted'
              }`} />
            )}
          </div>
        ))}
      </div>
      <div className="text-center px-4">
        <h2 className="text-lg sm:text-xl font-bold text-foreground mb-1">
          {steps[currentStep - 1]?.label}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </p>
      </div>
    </div>
  )
} 