"use client"

import { cities, cityMeta, type City } from '@/constants/cities'

interface CitySelectorProps {
  selectedCity: City
  onChange: (city: City) => void
}

export function CitySelector({ selectedCity, onChange }: CitySelectorProps) {
  return (
    <div className="space-y-4">
      <label className="block text-base sm:text-lg font-medium text-foreground mb-4">
        Waar wil je afspreken? 🌍
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {cities.map((city) => (
          <button
            key={city}
            type="button"
            onClick={() => onChange(city)}
            className={`p-4 sm:p-6 text-center border-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 ${
              selectedCity === city
                ? 'bg-amber-100 border-amber-500 text-amber-700 shadow-md'
                : 'bg-background border-border hover:border-amber-300 hover:shadow-sm'
            }`}
          >
            <div className="text-2xl sm:text-3xl mb-2">{cityMeta[city as keyof typeof cityMeta].emoji}</div>
            <div className="font-medium text-base sm:text-lg">{city}</div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-1">{cityMeta[city as keyof typeof cityMeta].tag}</div>
          </button>
        ))}
      </div>
      {selectedCity && (
        <div className="mt-4 p-3 sm:p-4 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-sm sm:text-base text-amber-700 font-medium">
            Geselecteerd: {selectedCity} {cityMeta[selectedCity as keyof typeof cityMeta].emoji}
          </p>
        </div>
      )}
    </div>
  )
} 