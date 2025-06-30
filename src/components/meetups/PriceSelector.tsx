"use client"

interface PriceSelectorProps {
  value: string
  onChange: (value: string) => void
}

export function PriceSelector({ value, onChange }: PriceSelectorProps) {
  const priceOptions = [
    { value: 'BUDGET', label: 'Budget friendly', emoji: '💰', description: 'Great value spots' },
    { value: 'MODERATE', label: 'Standard', emoji: '☕', description: 'Quality coffee shops' },
    { value: 'EXPENSIVE', label: 'Premium', emoji: '✨', description: 'Fancy cafes & roasters' },
    { value: 'LUXURY', label: 'Luxury', emoji: '💎', description: 'High-end experiences' }
  ]

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        What's your budget? 💰
      </label>
      <div className="space-y-3">
        {priceOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`w-full p-4 text-left border rounded-lg transition-all hover:scale-105 ${
              value === option.value
                ? 'bg-amber-100 border-amber-500 text-amber-700 shadow-md'
                : 'bg-white border-gray-300 hover:border-amber-300 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl">{option.emoji}</div>
              <div>
                <div className="font-medium">{option.label}</div>
                <div className="text-sm text-gray-500">{option.description}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
} 