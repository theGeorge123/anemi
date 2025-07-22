"use client"

import { NameInput } from './NameInput'
import { EmailInput } from './EmailInput'
import { CitySelector } from './CitySelector'
import { DatePicker } from './DatePicker'
import { TimeSelector } from './TimeSelector'
import { DateTimePreferences } from './DateTimePreferences'
import { PriceSelector } from './PriceSelector'
import { CafeSelector } from './CafeSelector'
import { ViewSelector } from './ViewSelector'
import { MapView } from './MapView'
import { CafeChoiceStep } from './CafeChoiceStep'
import { StepNavigation } from './StepNavigation'
import { type FormData } from './formValidation'
import { type City } from '@/constants/cities'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'

interface StepContentProps {
  currentStep: number
  formData: FormData
  onFormDataChange: (updates: Partial<FormData>) => void
  onNext: () => void
  onBack: () => void
  onFinish: () => void
  onTotalStepsChange?: (totalSteps: number) => void
}

export function StepContent({ 
  currentStep, 
  formData, 
  onFormDataChange, 
  onNext, 
  onBack, 
  onFinish,
  onTotalStepsChange
}: StepContentProps) {
  const [showDateTimePreferences, setShowDateTimePreferences] = useState(false)
  const [showCafeChoice, setShowCafeChoice] = useState(false)
  const [showCafeSelection, setShowCafeSelection] = useState(false)
  const [totalSteps, setTotalSteps] = useState(5)

  // Calculate total steps based on user choices
  useEffect(() => {
    let steps = 5 // Base steps
    
    if (showDateTimePreferences) steps++ // Extra step for date/time preferences
    if (showCafeChoice) steps++ // Extra step for cafe choice
    if (showCafeSelection) steps++ // Extra step for view selector
    if (showCafeSelection) steps++ // Extra step for cafe selection
    
    setTotalSteps(steps)
    
    // Notify parent component of total steps change
    if (onTotalStepsChange) {
      onTotalStepsChange(steps)
    }
  }, [showDateTimePreferences, showCafeChoice, showCafeSelection, onTotalStepsChange])

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return formData.name.trim() && formData.email.trim()
      case 2: return formData.city.trim()
      case 3: return formData.dates.length > 0 && formData.times.length > 0
      case 4: 
        if (showDateTimePreferences) {
          return Object.keys(formData.dateTimePreferences).length > 0
        }
        return true // Cafe choice step is always valid
      case 5: 
        if (showDateTimePreferences) {
          return true // Cafe choice step is always valid
        }
        if (showCafeSelection) {
          return formData.viewType // View selector step requires viewType
        }
        return true // Summary step is always valid
      case 6: 
        if (showDateTimePreferences && showCafeChoice) {
          return formData.viewType // View selector step requires viewType
        } else if (showDateTimePreferences) {
          return true // Cafe choice step is always valid
        } else if (showCafeSelection) {
          return true // Cafe selection step is always valid
        }
        return true // Summary step is always valid
      case 7: 
        if (showDateTimePreferences && showCafeChoice) {
          return true // Cafe selection step is always valid
        } else if (showDateTimePreferences && showCafeSelection) {
          return true // Cafe selection step is always valid
        }
        return true // Summary step is always valid
      case 8: return true // Summary step is always valid
      default: return true
    }
  }

  // Helper functions to split the large renderStep function
  const renderStep1 = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">👋 Leuk je te ontmoeten!</h3>
        <p className="text-gray-600">Laten we beginnen met je gegevens.</p>
      </div>
      <NameInput 
        value={formData.name}
        onChange={(name) => onFormDataChange({ name })}
      />
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-800">
          <span className="font-medium">📧 Email:</span> {formData.email || 'Laden...'}
        </p>
        <p className="text-xs text-amber-600 mt-1">
          We gebruiken je account email voor notificaties
        </p>
      </div>
      <p className="text-gray-600">Geen zorgen, je kunt dit later nog aanpassen.</p>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">🌍 Waar wil je afspreken?</h3>
        <p className="text-gray-600">Kies je voorkeursstad voor de meetup</p>
      </div>
      <CitySelector 
        selectedCity={formData.city}
        onChange={(city) => onFormDataChange({ city })}
      />
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">📅 Wanneer ben je beschikbaar?</h3>
        <p className="text-gray-600">Selecteer data en tijden die voor jou werken</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">📅 Kies 2-3 data:</h4>
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
        
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">⏰ Kies beschikbare tijden:</h4>
          <TimeSelector 
            selectedTimes={formData.times}
            onChange={(times) => onFormDataChange({ times })}
          />
        </div>
      </div>

      {formData.dates.length > 0 && formData.times.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800 mb-3">
            <strong>💡 Wil je verschillende tijden per datum specificeren?</strong>
          </p>
          <div className="flex gap-2">
            <Button 
              onClick={() => {
                setShowDateTimePreferences(true)
                onNext()
              }}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Ja, dat wil ik
            </Button>
            <Button 
              onClick={() => {
                setShowDateTimePreferences(false)
                onNext()
              }}
              variant="outline"
              size="sm"
            >
              Nee, alle data dezelfde tijden
            </Button>
          </div>
        </div>
      )}
    </div>
  )

  const renderDateTimePreferences = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">🗓️ Tijden per datum</h3>
        <p className="text-gray-600">Specificeer welke tijden voor elke datum werken</p>
      </div>
      <DateTimePreferences
        dates={formData.dates}
        availableTimes={formData.times}
        dateTimePreferences={formData.dateTimePreferences}
        onPreferencesChange={(preferences) => onFormDataChange({ dateTimePreferences: preferences })}
      />
    </div>
  )

  const renderCafeChoice = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">☕ Kies je cafe!</h3>
        <p className="text-gray-600">We hebben een perfecte plek gevonden of kies zelf</p>
      </div>
      <CafeChoiceStep
        selectedCity={formData.city}
        onCafeSelect={(cafeId) => {
          onFormDataChange({ cafeId })
          // If user accepts random cafe, go directly to summary
          onNext()
        }}
        onChooseOwn={() => {
          // Set cafe selection flag and advance to view selector
          setShowCafeSelection(true)
          onNext()
        }}
      />
    </div>
  )

  const renderViewSelector = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">🔍 Hoe wil je cafes bekijken?</h3>
        <p className="text-gray-600">Kies je voorkeur voor het ontdekken van cafes in {formData.city}</p>
      </div>
      <ViewSelector
        selectedView={formData.viewType || null}
        onViewSelect={(viewType) => {
          onFormDataChange({ viewType })
          onNext()
        }}
      />
    </div>
  )

  const renderCafeSelection = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {formData.viewType === 'map' ? '🗺️' : '📋'} Cafes in {formData.city}
        </h3>
        <p className="text-gray-600">
          {formData.viewType === 'map' 
            ? 'Bekijk cafes op de kaart en selecteer je favoriet'
            : 'Bekijk alle cafes en selecteer je favoriet'
          }
        </p>
      </div>
      {formData.viewType === 'map' ? (
        <MapView
          selectedCity={formData.city}
          selectedCafeId={formData.cafeId}
          onCafeSelect={(cafeId) => onFormDataChange({ cafeId })}
          onSkip={() => onFormDataChange({ cafeId: '' })}
        />
      ) : (
        <CafeSelector
          selectedCity={formData.city}
          selectedCafeId={formData.cafeId}
          onCafeSelect={(cafeId) => onFormDataChange({ cafeId })}
          onSkip={() => onFormDataChange({ cafeId: '' })}
        />
      )}
    </div>
  )

  const renderSummary = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🎉</span>
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-2">Je meetup is klaar!</h3>
        <p className="text-gray-600 text-lg">Tijd om je vriend uit te nodigen ☕</p>
      </div>
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-xl border border-amber-200 shadow-lg">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-3">📋</span>
          <h4 className="text-xl font-bold text-gray-900">Meetup Samenvatting</h4>
        </div>
        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex items-center">
            <span className="text-amber-600 mr-2">👤</span>
            <span><strong>Naam:</strong> {formData.name}</span>
          </div>
          <div className="flex items-center">
            <span className="text-amber-600 mr-2">📧</span>
            <span><strong>Email:</strong> {formData.email}</span>
          </div>
          <div className="flex items-center">
            <span className="text-amber-600 mr-2">🌍</span>
            <span><strong>Stad:</strong> {formData.city}</span>
          </div>
          <div className="flex items-center">
            <span className="text-amber-600 mr-2">📅</span>
            <span><strong>Data:</strong> {formData.dates.length} geselecteerd</span>
          </div>
          <div className="flex items-center">
            <span className="text-amber-600 mr-2">⏰</span>
            <span><strong>Tijden:</strong> {formData.times.length} beschikbaar</span>
          </div>
          {formData.cafeId && (
            <div className="flex items-center">
              <span className="text-amber-600 mr-2">☕</span>
              <span><strong>Cafe:</strong> Geselecteerd</span>
            </div>
          )}
          <div className="mt-3 pt-3 border-t border-amber-200">
            <p className="font-medium text-gray-900 mb-2">Geselecteerde Data:</p>
            {formData.dates.map((date) => (
              <div key={date} className="text-xs">
                <span className="font-medium">
                  {new Date(date).toLocaleDateString('nl-NL', { weekday: 'long', month: 'long', day: 'numeric' })}
                </span>
              </div>
            ))}
            <p className="font-medium text-gray-900 mb-2 mt-3">Beschikbare Tijden:</p>
            <div className="text-xs">
              <span>{formData.times.join(', ')}</span>
            </div>
            {Object.keys(formData.dateTimePreferences).length > 0 && (
              <>
                <p className="font-medium text-gray-900 mb-2 mt-3">Specifieke Tijden per Datum:</p>
                {Object.entries(formData.dateTimePreferences).map(([date, times]) => (
                  <div key={date} className="text-xs">
                    <span className="font-medium">
                      {new Date(date).toLocaleDateString('nl-NL', { weekday: 'short', month: 'short', day: 'numeric' })}:
                    </span>
                    <span className="ml-2">{times.join(', ')}</span>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep = () => {
    switch (currentStep) {
      case 1: return renderStep1()
      case 2: return renderStep2()
      case 3: return renderStep3()
      case 4:
        if (showDateTimePreferences) {
          return renderDateTimePreferences()
        } else {
          return renderCafeChoice()
        }
      case 5:
        if (showDateTimePreferences) {
          return renderCafeChoice()
        } else if (showCafeSelection) {
          return renderViewSelector()
        } else {
          return renderSummary()
        }
      case 6:
        if (showDateTimePreferences && showCafeChoice) {
          return renderViewSelector()
        } else if (showDateTimePreferences) {
          return renderCafeChoice()
        } else if (showCafeSelection) {
          return renderCafeSelection()
        } else {
          return renderSummary()
        }
      case 7:
        if (showDateTimePreferences && showCafeChoice) {
          return renderCafeSelection()
        } else if (showDateTimePreferences && showCafeSelection) {
          return renderCafeSelection()
        } else {
          return renderSummary()
        }
      case 8: return renderSummary()
      default: return null
    }
  }

  return (
    <div>
      {renderStep()}
      <StepNavigation
        currentStep={currentStep}
        totalSteps={totalSteps}
        onNext={currentStep === totalSteps ? onFinish : onNext}
        onBack={onBack}
        isNextDisabled={!isStepValid()}
        nextLabel={currentStep === totalSteps ? 'Genereer Invite Code! 🎫' : 'Volgende'}
      />
    </div>
  )
} 