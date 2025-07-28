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
              <div key={date} className={`border rounded-xl p-4 sm:p-6 shadow-sm transition-all duration-200 ${
                dateStatus.isComplete 
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-green-100' 
                  : 'bg-white border-gray-200 hover:border-amber-200 hover:shadow-md'
              }`}>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                  <div>
                    <h4 className={`font-semibold text-lg ${
                      dateStatus.isComplete ? 'text-green-800' : 'text-foreground'
                    }`}>
                      {formatDate(date)}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Kies je gewenste tijden voor deze dag
                    </p>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm ${
                    dateStatus.isComplete 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'bg-amber-100 text-amber-700 border border-amber-200'
                  }`}>
                    {dateStatus.isComplete ? (
                      <>
                        <span>✅</span>
                        <span className="font-medium">{dateStatus.timesCount}</span>
                      </>
                    ) : (
                      <>
                        <span>⏳</span>
                        <span className="font-medium">0</span>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Mobile: Single column list, Desktop: Grid */}
                <div className="block sm:hidden space-y-2">
                  {timeSlots
                    .filter(slot => availableTimes.includes(slot.value))
                    .map((slot) => {
                      const isSelected = (dateTimePreferences[date] || []).includes(slot.value)
                      return (
                        <button
                          key={slot.value}
                          type="button"
                          onClick={() => handleTimeToggle(date, slot.value)}
                          className={`w-full p-4 border rounded-xl transition-all duration-200 flex items-center justify-between min-h-[60px] ${
                            isSelected
                              ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-400 text-amber-800 shadow-lg ring-2 ring-amber-200'
                              : 'bg-white border-gray-200 hover:border-amber-300 hover:shadow-md hover:bg-amber-50/30'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">{slot.emoji}</div>
                            <div className="text-left">
                              <div className="font-semibold text-base">{slot.label}</div>
                              <div className="text-sm text-gray-600">
                                {slot.value === '09:00' && 'Vroege start'}
                                {slot.value === '11:00' && 'Koffie tijd'}
                                {slot.value === '12:00' && 'Lunch tijd'}
                                {slot.value === '14:00' && 'Middag koffie'}
                                {slot.value === '15:00' && 'Thee tijd'}
                                {slot.value === '17:00' && 'After work'}
                                {slot.value === '18:00' && 'Avond start'}
                                {(slot.value === '10:00' || slot.value === '13:00' || slot.value === '16:00') && 'Perfecte tijd'}
                              </div>
                            </div>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-amber-500 border-amber-500'
                              : 'border-gray-300'
                          }`}>
                            {isSelected && (
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </button>
                      )
                    })}
                </div>

                {/* Desktop: Grid layout */}
                <div className="hidden sm:grid sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
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
                  <div className="mt-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-amber-600">✅</span>
                        <p className="text-sm font-medium text-amber-800">
                          {dateStatus.timesCount} tijd{dateStatus.timesCount !== 1 ? 'en' : ''} geselecteerd
                        </p>
                      </div>
                      <div className="text-xs text-amber-600 bg-white px-2 py-1 rounded-full">
                        {Math.round((dateStatus.timesCount / timeSlots.filter(slot => availableTimes.includes(slot.value)).length) * 100)}%
                      </div>
                    </div>
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