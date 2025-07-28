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

  // Check validation status for each date
  const getDateValidationStatus = (date: string) => {
    const timesForDate = dateTimePreferences[date] || []
    const hasTimes = timesForDate.length > 0
    
    return {
      hasTimes,
      timesCount: timesForDate.length,
      isComplete: hasTimes
    }
  }

  // Get overall validation status
  const getOverallValidationStatus = () => {
    const incompleteDates = dates.filter(date => {
      const timesForDate = dateTimePreferences[date] || []
      return timesForDate.length === 0
    })
    
    return {
      isComplete: incompleteDates.length === 0,
      incompleteDates,
      totalDates: dates.length,
      completedDates: dates.length - incompleteDates.length
    }
  }

  const validationStatus = getOverallValidationStatus()

  return (
    <div className="space-y-6">
      {/* Validation Summary */}
      <div className={`p-4 rounded-lg border ${
        validationStatus.isComplete 
          ? 'bg-green-50 border-green-200' 
          : 'bg-amber-50 border-amber-200'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`font-medium ${
              validationStatus.isComplete ? 'text-green-800' : 'text-amber-800'
            }`}>
              {validationStatus.isComplete ? '✅ Alle datums compleet!' : '⚠️ Nog niet alle datums compleet'}
            </h3>
            <p className={`text-sm ${
              validationStatus.isComplete ? 'text-green-700' : 'text-amber-700'
            }`}>
              {validationStatus.completedDates} van {validationStatus.totalDates} datums hebben tijden geselecteerd
            </p>
          </div>
          <div className={`text-2xl ${
            validationStatus.isComplete ? 'text-green-600' : 'text-amber-600'
          }`}>
            {validationStatus.isComplete ? '🎉' : '⏳'}
          </div>
        </div>
        
        {!validationStatus.isComplete && validationStatus.incompleteDates.length > 0 && (
          <div className="mt-3">
            <p className="text-sm text-amber-700 font-medium mb-2">
              Nog te selecteren datums:
            </p>
            <div className="flex flex-wrap gap-2">
              {validationStatus.incompleteDates.map(date => (
                <span key={date} className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-md">
                  {formatDate(date)}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Date/Time Selection */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Set specific times for each date 🗓️
        </label>
        <div className="space-y-4">
          {dates.map((date) => {
            const dateStatus = getDateValidationStatus(date)
            
            return (
              <div key={date} className={`border rounded-lg p-4 ${
                dateStatus.isComplete ? 'bg-green-50 border-green-200' : 'bg-background border-border'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className={`font-medium ${
                    dateStatus.isComplete ? 'text-green-800' : 'text-foreground'
                  }`}>
                    {formatDate(date)}
                  </h4>
                  <div className={`flex items-center gap-2 ${
                    dateStatus.isComplete ? 'text-green-600' : 'text-amber-600'
                  }`}>
                    {dateStatus.isComplete ? (
                      <>
                        <span className="text-sm">✅</span>
                        <span className="text-xs">{dateStatus.timesCount} tijd{dateStatus.timesCount !== 1 ? 'en' : ''}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-sm">⏳</span>
                        <span className="text-xs">Selecteer tijden</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                  {timeSlots
                    .filter(slot => availableTimes.includes(slot.value))
                    .map((slot) => {
                      const isSelected = (dateTimePreferences[date] || []).includes(slot.value)
                      return (
                        <button
                          key={slot.value}
                          type="button"
                          onClick={() => handleTimeToggle(date, slot.value)}
                          className={`p-2 sm:p-3 text-xs sm:text-sm border rounded-md transition-all hover:scale-105 min-h-[44px] touch-target ${
                            isSelected
                              ? 'bg-amber-100 border-amber-500 text-amber-700 shadow-md'
                              : 'bg-muted border-border hover:border-amber-300 hover:shadow-sm'
                          }`}
                        >
                          <div className="text-sm sm:text-base mb-1">{slot.emoji}</div>
                          <div className="font-medium text-xs sm:text-sm">{slot.label}</div>
                        </button>
                      )
                    })}
                </div>
                
                {dateStatus.timesCount > 0 && (
                  <div className="mt-2 p-2 bg-amber-50 rounded-md">
                    <p className="text-xs text-amber-700">
                      {dateStatus.timesCount} tijd{dateStatus.timesCount !== 1 ? 'en' : ''} geselecteerd
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
} 