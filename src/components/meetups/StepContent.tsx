"use client"

import { NameInput } from './NameInput'
import { EmailInput } from './EmailInput'
import { CitySelector } from './CitySelector'
import { DatePicker } from './DatePicker'
import { TimeSelector } from './TimeSelector'
import { DateTimePreferences } from './DateTimePreferences'
import { PriceSelector } from './PriceSelector'
import { StepNavigation } from './StepNavigation'
import { type FormData } from './formValidation'

interface StepContentProps {
  currentStep: number
  formData: FormData
  onFormDataChange: (updates: Partial<FormData>) => void
  onNext: () => void
  onBack: () => void
  onFinish: () => void
}

export function StepContent({ 
  currentStep, 
  formData, 
  onFormDataChange, 
  onNext, 
  onBack, 
  onFinish 
}: StepContentProps) {
  const isStepValid = () => {
    switch (currentStep) {
      case 1: return formData.name.trim() && formData.email.trim()
      case 2: return formData.city.trim()
      case 3: return formData.dates.length > 0
      case 4: return formData.times.length > 0
      case 5: return Object.keys(formData.dateTimePreferences).length > 0
      case 6: return formData.priceRange
      default: return true
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">👋 Nice to meet you!</h3>
              <p className="text-gray-600">Let&apos;s get started by entering your details.</p>
            </div>
            <NameInput 
              value={formData.name}
              onChange={(name) => onFormDataChange({ name })}
            />
            <EmailInput 
              value={formData.email}
              onChange={(email) => onFormDataChange({ email })}
            />
            <p className="text-gray-600">Don&apos;t worry, you can change this later.</p>
          </div>
        )
      
      case 2:
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">🌍 Where do you want to meet?</h3>
              <p className="text-gray-600">Choose your preferred city for the meetup</p>
            </div>
            <CitySelector 
              selectedCity={formData.city}
              onChange={(city) => onFormDataChange({ city })}
            />
          </div>
        )
      
      case 3:
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">📅 Pick your dates!</h3>
              <p className="text-gray-600">Select 2-3 dates that work for you</p>
            </div>
            <DatePicker 
              selectedDates={formData.dates}
              onDateToggle={(date) => {
                const newDates = formData.dates.includes(date)
                  ? formData.dates.filter(d => d !== date)
                  : [...formData.dates, date]
                onFormDataChange({ dates: newDates })
              }}
            />
          </div>
        )
      
      case 4:
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">⏰ What times work?</h3>
              <p className="text-gray-600">Choose all the times that work for you</p>
            </div>
            <TimeSelector 
              selectedTimes={formData.times}
              onChange={(times) => onFormDataChange({ times })}
            />
          </div>
        )
      
      case 5:
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">🗓️ Match dates with times!</h3>
              <p className="text-gray-600">Set specific times for each selected date</p>
            </div>
            <DateTimePreferences
              dates={formData.dates}
              availableTimes={formData.times}
              dateTimePreferences={formData.dateTimePreferences}
              onPreferencesChange={(preferences) => onFormDataChange({ dateTimePreferences: preferences })}
            />
          </div>
        )
      
      case 6:
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">💰 What&apos;s your budget?</h3>
              <p className="text-gray-600">We&apos;ll find the perfect spot for you</p>
            </div>
            <PriceSelector 
              value={formData.priceRange}
              onChange={(priceRange) => onFormDataChange({ priceRange })}
            />
          </div>
        )
      
      case 7:
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">🎉 You&apos;re all set!</h3>
              <p className="text-gray-600">Ready to find your perfect coffee spot?</p>
            </div>
            <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
              <h4 className="font-semibold text-gray-900 mb-3">Meetup Summary:</h4>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>Name:</strong> {formData.name}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>City:</strong> {formData.city}</p>
                <p><strong>Dates:</strong> {formData.dates.length} selected</p>
                <p><strong>Times:</strong> {formData.times.length} available</p>
                <p><strong>Budget:</strong> {formData.priceRange}</p>
                <div className="mt-3 pt-3 border-t border-amber-200">
                  <p className="font-medium text-gray-900 mb-2">Date & Time Preferences:</p>
                  {Object.entries(formData.dateTimePreferences).map(([date, times]) => (
                    <div key={date} className="text-xs">
                      <span className="font-medium">
                        {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}:
                      </span>
                      <span className="ml-2">{times.join(', ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div>
      {renderStep()}
      <StepNavigation
        currentStep={currentStep}
        totalSteps={7}
        onNext={currentStep === 7 ? onFinish : onNext}
        onBack={onBack}
        isNextDisabled={!isStepValid()}
        nextLabel={currentStep === 7 ? 'Find Coffee Shop! ☕' : 'Next'}
      />
    </div>
  )
} 