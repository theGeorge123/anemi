"use client"

import { NameInput } from './NameInput'
import { EmailInput } from './EmailInput'
import { CitySelector } from './CitySelector'
import { DatePicker } from './DatePicker'
import { TimeSelector } from './TimeSelector'
import { CafeChoiceStep } from './CafeChoiceStep'
import { CafeSelector } from './CafeSelector'
import { ViewSelector } from './ViewSelector'
import MapView from './MapView'
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
  const [showCafeChoice, setShowCafeChoice] = useState(false)
  const [showCafeSelection, setShowCafeSelection] = useState(false)
  const [totalSteps, setTotalSteps] = useState(5)

  // Calculate total steps based on user choices
  useEffect(() => {
    let steps = 5 // Base steps - always keep it at 5
    
    // Don't add extra steps for cafe selection or multiple times
    // Everything stays within the 5 base steps
    
    setTotalSteps(steps)
    
    // Notify parent component of total steps change
    if (onTotalStepsChange) {
      onTotalStepsChange(steps)
    }
  }, [onTotalStepsChange])

  // Check if we should show date/time preferences step
  const shouldShowDateTimePreferences = () => {
    return false // Always false since we removed this functionality
  }

  // Check if we should show cafe selection step
  const shouldShowCafeSelection = () => {
    return showCafeSelection
  }

  // Get the actual step content based on current step and user choices
  const getActualStep = () => {
    if (currentStep === 4) {
      return 'cafeChoice'
    } else if (currentStep === 5) {
      return 'summary'
    }
    return currentStep
  }

  const isStepValid = () => {
    const actualStep = getActualStep()
    
    switch (actualStep) {
      case 1: return formData.name.trim() && formData.email.trim()
      case 2: return formData.city.trim()
      case 3: return formData.dates.length > 0 && formData.times.length > 0
      case 'cafeChoice': 
        // Always require cafeId regardless of selection method (random or manual)
        return !!formData.cafeId
      case 'summary': return true // Summary step is always valid
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
      
      {/* Show email input if no email is preset (guest users) */}
      {!formData.email || formData.email === '' ? (
        <EmailInput 
          value={formData.email}
          onChange={(email) => onFormDataChange({ email })}
        />
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-800">
            <span className="font-medium">📧 Email:</span> {formData.email}
          </p>
          <p className="text-xs text-amber-600 mt-1">
            We gebruiken je account email voor uitnodigingen
          </p>
        </div>
      )}
      

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
    </div>
  )

  const renderCafeChoice = () => {
    // If user chose to select their own cafe, show cafe selection directly
    if (showCafeSelection) {
      return renderCafeSelection()
    }
    
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">☕ Kies je cafe!</h3>
          <p className="text-gray-600">We hebben een perfecte plek gevonden of kies zelf</p>
        </div>
        <CafeChoiceStep
          selectedCity={formData.city}
          onCafeSelect={(cafeId) => {
            console.log('🎯 Random cafe selected:', cafeId)
            console.log('🎯 Current step:', currentStep)
            onFormDataChange({ cafeId })
            // If user accepts random cafe, check if we should finish or continue
            // If we're at step 5 (final step), finish
            if (currentStep >= 5) {
              console.log('🎯 Calling onFinish()')
              onFinish()
            } else {
              console.log('🎯 Calling onNext()')
              onNext()
            }
          }}
          onChooseOwn={() => {
            // Go directly to cafe selection without adding extra steps
            setShowCafeSelection(true)
            // Set default view type to list if not already set
            if (!formData.viewType) {
              onFormDataChange({ viewType: 'list' })
            }
            // Stay on the same step but show cafe selection
          }}
          onBackToCitySelection={() => {
            // Go back to step 2 (city selection)
            onBack()
          }}
        />
      </div>
    )
  }

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
      
      {/* Back to city selection button */}
      <div className="flex justify-start">
        <Button
          onClick={() => {
            setShowCafeSelection(false)
            onBack()
          }}
          variant="outline"
          className="text-gray-600 hover:text-gray-800 border-gray-300 hover:border-gray-400"
        >
          ← Terug naar stad kiezen
        </Button>
      </div>
      
      {formData.viewType === 'map' ? (
        <MapView
          selectedCity={formData.city}
          onCafeSelect={(cafe) => onFormDataChange({ cafeId: cafe.id })}
        />
      ) : (
        <CafeSelector
          selectedCity={formData.city}
          selectedCafeId={formData.cafeId}
          onCafeSelect={(cafeId) => onFormDataChange({ cafeId })}
          onSkip={() => {
            // Reset cafe selection and go back to cafe choice step
            onFormDataChange({ cafeId: '' })
            setShowCafeSelection(false)
          }}
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
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep = () => {
    const actualStep = getActualStep()
    
    switch (actualStep) {
      case 1: return renderStep1()
      case 2: return renderStep2()
      case 3: return renderStep3()
      case 'cafeChoice': return renderCafeChoice()
      case 'summary': return renderSummary()
      default: return renderSummary()
    }
  }

  // Get validation message for current step
  const getValidationMessage = () => {
    const actualStep = getActualStep()
    
    switch (actualStep) {
      case 1:
        if (!formData.name.trim()) return 'Voer je naam in'
        if (!formData.email.trim()) return 'Email is vereist'
        return '✅ Stap 1 compleet!'
        
      case 2:
        if (!formData.city.trim()) return 'Selecteer een stad'
        return '✅ Stad geselecteerd!'
        
      case 3:
        if (formData.dates.length === 0) return 'Selecteer minimaal 1 datum'
        if (formData.times.length === 0) return 'Selecteer minimaal 1 tijd'
        return '✅ Data en tijden geselecteerd!'
        
      case 'cafeChoice':
        if (!formData.cafeId) return 'Selecteer een cafe of kies voor willekeurig'
        return '✅ Cafe geselecteerd!'
        
      case 'summary':
        return '✅ Alles compleet! Klaar om invite code te genereren'
        
      default:
        return ''
    }
  }

  return (
    <div className="px-2 sm:px-0">
      {renderStep()}
      <StepNavigation
        currentStep={currentStep}
        totalSteps={totalSteps}
        onNext={currentStep === totalSteps ? onFinish : onNext}
        onBack={onBack}
        isNextDisabled={!isStepValid()}
        nextLabel={currentStep === totalSteps ? 'Genereer Invite Code! 🎫' : 'Volgende'}
        validationMessage={getValidationMessage()}
        isValid={isStepValid() === true}
      />
    </div>
  )
} 