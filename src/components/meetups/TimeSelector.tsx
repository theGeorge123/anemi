"use client"

interface TimeSelectorProps {
  selectedTimes: string[]
  onChange: (times: string[]) => void
}

export function TimeSelector({ selectedTimes, onChange }: TimeSelectorProps) {
  const timeSlots = [
    { value: '09:00', label: '9:00', emoji: '☀️' },
    { value: '10:00', label: '10:00', emoji: '🌅' },
    { value: '11:00', label: '11:00', emoji: '☕' },
    { value: '12:00', label: '12:00', emoji: '🍽️' },
    { value: '13:00', label: '13:00', emoji: '🌞' },
    { value: '14:00', label: '14:00', emoji: '☕' },
    { value: '15:00', label: '15:00', emoji: '🍰' },
    { value: '16:00', label: '16:00', emoji: '🌅' },
    { value: '17:00', label: '17:00', emoji: '🌆' },
    { value: '18:00', label: '18:00', emoji: '🌃' }
  ]

  const handleTimeToggle = (time: string) => {
    const newTimes = selectedTimes.includes(time)
      ? selectedTimes.filter(t => t !== time)
      : [...selectedTimes, time]
    onChange(newTimes)
  }

  return (
    <div className="space-y-4">
      <label className="block text-base sm:text-lg font-medium text-foreground mb-4">
        Welke tijden passen jou? ⏰ (Selecteer meerdere)
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {timeSlots.map((slot) => (
          <button
            key={slot.value}
            type="button"
            onClick={() => handleTimeToggle(slot.value)}
            className={`p-3 sm:p-4 text-center border-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 ${
              selectedTimes.includes(slot.value)
                ? 'bg-amber-100 border-amber-500 text-amber-700 shadow-md'
                : 'bg-background border-border hover:border-amber-300 hover:shadow-sm'
            }`}
          >
            <div className="text-lg sm:text-xl mb-1">{slot.emoji}</div>
            <div className="font-medium text-sm sm:text-base">{slot.label}</div>
          </button>
        ))}
      </div>
      {selectedTimes.length > 0 && (
        <div className="mt-4 p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm sm:text-base text-green-700 font-medium">
            Geselecteerd: {selectedTimes.length} tijd{selectedTimes.length !== 1 ? 'en' : ''}
          </p>
        </div>
      )}
    </div>
  )
} 