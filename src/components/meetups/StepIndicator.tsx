"use client"

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  const steps = [
    { number: 1, label: 'Who are you?', emoji: '👋' },
    { number: 2, label: 'Where?', emoji: '🌍' },
    { number: 3, label: 'When?', emoji: '📅' },
    { number: 4, label: 'What times?', emoji: '⏰' },
    { number: 5, label: 'Date + Time', emoji: '🗓️' },
    { number: 6, label: 'Budget?', emoji: '💰' },
    { number: 7, label: 'Ready!', emoji: '🎉' }
  ]

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
              step.number <= currentStep
                ? 'bg-amber-500 border-amber-500 text-white'
                : 'bg-background border-muted text-muted-foreground'
            }`}>
              <span className="text-sm font-bold">{step.emoji}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-10 h-1 mx-2 transition-all ${
                step.number < currentStep ? 'bg-amber-500' : 'bg-muted'
              }`} />
            )}
          </div>
        ))}
      </div>
      <div className="text-center">
        <h2 className="text-xl font-bold text-foreground mb-1">
          {steps[currentStep - 1]?.label}
        </h2>
        <p className="text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </p>
      </div>
    </div>
  )
} 