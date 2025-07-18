"use client"

interface TimeSelectorProps {
  selectedTimes: string[]
  onChange: (times: string[]) => void
}

export function TimeSelector({ selectedTimes, onChange }: TimeSelectorProps) {
  const timeSlots = [
    { value: '09:00', label: '9:00 AM', emoji: '☀️' },
    { value: '10:00', label: '10:00 AM', emoji: '🌅' },
    { value: '11:00', label: '11:00 AM', emoji: '☕' },
    { value: '12:00', label: '12:00 PM', emoji: '🍽️' },
    { value: '13:00', label: '1:00 PM', emoji: '🌞' },
    { value: '14:00', label: '2:00 PM', emoji: '☕' },
    { value: '15:00', label: '3:00 PM', emoji: '🍰' },
    { value: '16:00', label: '4:00 PM', emoji: '🌅' },
    { value: '17:00', label: '5:00 PM', emoji: '🌆' },
    { value: '18:00', label: '6:00 PM', emoji: '🌃' }
  ]

  const handleTimeToggle = (time: string) => {
    const newTimes = selectedTimes.includes(time)
      ? selectedTimes.filter(t => t !== time)
      : [...selectedTimes, time]
    onChange(newTimes)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">
        What times work for you? ⏰ (Select multiple)
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {timeSlots.map((slot) => (
          <button
            key={slot.value}
            type="button"
            onClick={() => handleTimeToggle(slot.value)}
            className={`p-3 text-sm border rounded-md transition-all hover:scale-105 ${
              selectedTimes.includes(slot.value)
                ? 'bg-amber-100 border-amber-500 text-amber-700 shadow-md'
                : 'bg-background border-border hover:border-amber-300 hover:shadow-sm'
            }`}
          >
            <div className="text-lg mb-1">{slot.emoji}</div>
            <div className="font-medium">{slot.label}</div>
          </button>
        ))}
      </div>
      {selectedTimes.length > 0 && (
        <div className="mt-3 p-2 bg-amber-50 rounded-md">
          <p className="text-sm text-amber-700">
            Selected: {selectedTimes.length} time{selectedTimes.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  )
} 