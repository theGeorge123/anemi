"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { StepIndicator } from '@/components/meetups/StepIndicator'
import { StepContent } from '@/components/meetups/StepContent'
import { type FormData } from '@/components/meetups/formValidation'
import { type City } from '@/constants/cities'

export default function CreatePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    city: 'Amsterdam' as City,
    dates: [],
    times: [],
    dateTimePreferences: {},
    priceRange: 'MODERATE'
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleFormDataChange = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleFinish = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/shuffle-cafe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          priceRange: formData.priceRange,
          city: formData.city 
        })
      })
      
      if (response.ok) {
        const cafe = await response.json()
        router.push(`/result?cafe=${encodeURIComponent(JSON.stringify(cafe))}&form=${encodeURIComponent(JSON.stringify(formData))}`)
      } else {
        alert('Failed to find a cafe. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">☕ Create a Meetup</h1>
          <p className="text-gray-600">Let's find you the perfect coffee spot!</p>
        </div>

        <Card className="shadow-lg animate-bounceIn">
          <CardContent className="p-8">
            <StepIndicator currentStep={currentStep} totalSteps={7} />
            <StepContent
              currentStep={currentStep}
              formData={formData}
              onFormDataChange={handleFormDataChange}
              onNext={handleNext}
              onBack={handleBack}
              onFinish={handleFinish}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 