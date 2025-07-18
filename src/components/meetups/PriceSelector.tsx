"use client"

import { PriceRange } from '@prisma/client'
import { type City } from '@/constants/cities'

interface PriceSelectorProps {
  value: PriceRange
  onChange: (value: PriceRange) => void
  city: City
}

export function PriceSelector({ value, onChange, city }: PriceSelectorProps) {
  const priceOptions = [
    { value: 'BUDGET', label: 'Budget friendly', emoji: '💰', description: 'Great value spots' },
    { value: 'MODERATE', label: 'Standard', emoji: '☕', description: 'Quality coffee shops' },
    { value: 'EXPENSIVE', label: 'Premium', emoji: '✨', description: 'Fancy cafes & roasters' },
    { value: 'LUXURY', label: 'Luxury', emoji: '💎', description: 'High-end experiences' }
  ]

  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">
        What&apos;s your budget? 💰
      </label>
      <div className="space-y-3">
        {priceOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value as PriceRange)}
            className={`w-full p-4 text-left border rounded-lg transition-all hover:scale-105 ${
              value === option.value
                ? 'bg-amber-100 border-amber-500 text-amber-700 shadow-md'
                : 'bg-background border-border hover:border-amber-300 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl">{option.emoji}</div>
              <div>
                <div className="font-medium">{option.label}</div>
                <div className="text-sm text-muted-foreground">{option.description}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <span className="font-medium">💡 Tip:</span> You can also pick your own cafe! 
          We&apos;ll show you a nice list of cafes in {city} with pictures and descriptions.
        </p>
      </div>
    </div>
  )
} 