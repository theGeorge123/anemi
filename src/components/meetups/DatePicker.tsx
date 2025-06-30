"use client"

interface DatePickerProps {
  selectedDates: string[]
  onDateToggle: (date: string) => void
}

export function DatePicker({ selectedDates, onDateToggle }: DatePickerProps) {
  // Generate next 7 days with emojis
  const nextDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i + 1)
    const dayOfWeek = date.getDay()
    const emojis = ['🌅', '☀️', '🌤️', '⛅', '🌥️', '🌦️', '🌈']
    return {
      date: date.toISOString().split('T')[0] || '',
      emoji: emojis[dayOfWeek]
    }
  })

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Available Dates (Select 2-3) 📅
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {nextDays.map(({ date, emoji }) => {
          if (!date) return null
          const dateObj = new Date(date)
          const isSelected = selectedDates.includes(date)
          return (
            <button
              key={date}
              type="button"
              onClick={() => onDateToggle(date)}
              className={`p-4 text-sm border rounded-lg transition-all hover:scale-105 ${
                isSelected
                  ? 'bg-amber-100 border-amber-500 text-amber-700 shadow-md'
                  : 'bg-white border-gray-300 hover:border-amber-300 hover:shadow-sm'
              }`}
            >
              <div className="text-lg mb-1">{emoji}</div>
              <div className="font-medium">
                {dateObj.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className="text-xs text-gray-500">
                {dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
} 