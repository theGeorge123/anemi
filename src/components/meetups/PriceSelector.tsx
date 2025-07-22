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
    { value: 'BUDGET', label: 'Budget vriendelijk', emoji: '💰', description: 'Goede waarde plekken' },
    { value: 'MODERATE', label: 'Standaard', emoji: '☕', description: 'Kwaliteit koffie shops' },
    { value: 'EXPENSIVE', label: 'Premium', emoji: '✨', description: 'Fancy cafes & roasters' },
    { value: 'LUXURY', label: 'Luxe', emoji: '💎', description: 'High-end ervaringen' }
  ]

  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">
        Wat is je budget? 💰
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
          <span className="font-medium">💡 Tip:</span> Je kunt ook je eigen cafe kiezen! 
          We laten je een mooie lijst van cafes in {city} zien met foto&apos;s en beschrijvingen.
        </p>
      </div>
    </div>
  )
} 