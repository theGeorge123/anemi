"use client"

interface DateTimePreferencesProps {
  dates: string[]
  availableTimes: string[]
  dateTimePreferences: Record<string, string[]>
  onPreferencesChange: (preferences: Record<string, string[]>) => void
}

export function DateTimePreferences({ 
  dates, 
  availableTimes, 
  dateTimePreferences, 
  onPreferencesChange 
}: DateTimePreferencesProps) {
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

  const handleTimeToggle = (date: string, time: string) => {
    const currentTimes = dateTimePreferences[date] || []
    const newTimes = currentTimes.includes(time)
      ? currentTimes.filter(t => t !== time)
      : [...currentTimes, time]
    
    onPreferencesChange({
      ...dateTimePreferences,
      [date]: newTimes
    })
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Set specific times for each date 🗓️
      </label>
      <div className="space-y-4">
        {dates.map((date) => (
          <div key={date} className="border rounded-lg p-4 bg-white">
            <h4 className="font-medium text-gray-900 mb-3">
              {formatDate(date)}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {timeSlots
                .filter(slot => availableTimes.includes(slot.value))
                .map((slot) => {
                  const isSelected = (dateTimePreferences[date] || []).includes(slot.value)
                  return (
                    <button
                      key={slot.value}
                      type="button"
                      onClick={() => handleTimeToggle(date, slot.value)}
                      className={`p-2 text-xs border rounded-md transition-all hover:scale-105 ${
                        isSelected
                          ? 'bg-amber-100 border-amber-500 text-amber-700 shadow-md'
                          : 'bg-gray-50 border-gray-300 hover:border-amber-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="text-sm mb-1">{slot.emoji}</div>
                      <div className="font-medium">{slot.label}</div>
                    </button>
                  )
                })}
            </div>
            {(dateTimePreferences[date] || []).length > 0 && (
              <div className="mt-2 p-2 bg-amber-50 rounded-md">
                <p className="text-xs text-amber-700">
                  {dateTimePreferences[date]?.length || 0} time{(dateTimePreferences[date]?.length || 0) !== 1 ? 's' : ''} selected
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 