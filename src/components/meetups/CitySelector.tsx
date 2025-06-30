"use client"

import { cities, cityMeta, type City } from '@/constants/cities'

interface CitySelectorProps {
  selectedCity: City
  onChange: (city: City) => void
}

export function CitySelector({ selectedCity, onChange }: CitySelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Where do you want to meet? 🌍
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cities.map((city) => (
          <button
            key={city}
            type="button"
            onClick={() => onChange(city)}
            className={`p-6 text-center border rounded-lg transition-all hover:scale-105 ${
              selectedCity === city
                ? 'bg-amber-100 border-amber-500 text-amber-700 shadow-md'
                : 'bg-white border-gray-300 hover:border-amber-300 hover:shadow-sm'
            }`}
          >
            <div className="text-3xl mb-2">{cityMeta[city].emoji}</div>
            <div className="font-medium text-lg">{city}</div>
            <div className="text-sm text-gray-500 mt-1">{cityMeta[city].tag}</div>
          </button>
        ))}
      </div>
      {selectedCity && (
        <div className="mt-3 p-2 bg-amber-50 rounded-md">
          <p className="text-sm text-amber-700">
            Selected: {selectedCity} {cityMeta[selectedCity].emoji}
          </p>
        </div>
      )}
    </div>
  )
} 