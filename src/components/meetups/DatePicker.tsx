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
    <div className="space-y-4">
      <label className="block text-base sm:text-lg font-medium text-foreground mb-4">
        Beschikbare Datums (Selecteer 2-3) 📅
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {nextDays.map(({ date, emoji }) => {
          if (!date) return null
          const dateObj = new Date(date)
          const isSelected = selectedDates.includes(date)
          return (
            <button
              key={date}
              type="button"
              onClick={() => onDateToggle(date)}
              className={`p-3 sm:p-4 text-center border-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 ${
                isSelected
                  ? 'bg-amber-100 border-amber-500 text-amber-700 shadow-md'
                  : 'bg-background border-border hover:border-amber-300 hover:shadow-sm'
              }`}
            >
              <div className="text-lg sm:text-xl mb-1">{emoji}</div>
              <div className="font-medium text-sm sm:text-base">
                {dateObj.toLocaleDateString('nl-NL', { weekday: 'short' })}
              </div>
              <div className="text-xs text-muted-foreground">
                {dateObj.toLocaleDateString('nl-NL', { month: 'short', day: 'numeric' })}
              </div>
            </button>
          )
        })}
      </div>
      {selectedDates.length > 0 && (
        <div className="mt-4 p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm sm:text-base text-green-700 font-medium">
            Geselecteerd: {selectedDates.length} datum{selectedDates.length !== 1 ? 'en' : ''}
          </p>
        </div>
      )}
    </div>
  )
} 