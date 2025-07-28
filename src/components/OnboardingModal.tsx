"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, Coffee, Users, MapPin, Mail, Calendar, ArrowRight, Sparkles } from 'lucide-react'

interface OnboardingModalProps {
  isOpen: boolean
  onClose: () => void
}

interface OnboardingStep {
  id: number
  title: string
  description: string
  icon: React.ReactNode
  emoji: string
  details: string[]
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: "Welkom bij Anemi Meets! ☕",
    description: "Ontdek hoe je spontane koffie meetups kunt organiseren",
    icon: <Coffee className="w-8 h-8 text-amber-600" />,
    emoji: "🎉",
    details: [
      "Verbind met vrienden over een kopje koffie",
      "Ontdek nieuwe cafés in je stad", 
      "Eenvoudig meetups plannen en delen"
    ]
  },
  {
    id: 2,
    title: "Zo werkt het",
    description: "In 3 eenvoudige stappen naar je perfecte meetup",
    icon: <Users className="w-8 h-8 text-blue-600" />,
    emoji: "🚀",
    details: [
      "1️⃣ Kies je naam, stad en beschikbare tijden",
      "2️⃣ Wij vinden het perfecte café voor jullie",
      "3️⃣ Deel je invite code met vrienden"
    ]
  },
  {
    id: 3,
    title: "Uitnodigingen ontvangen?",
    description: "Gebruik gewoon je invite code om mee te doen",
    icon: <Mail className="w-8 h-8 text-green-600" />,
    emoji: "📧",
    details: [
      "🔍 Voer je invite code in op de homepage",
      "📅 Kies je voorkeursdata en tijden", 
      "✅ Accepteer en jullie meetup is gepland!"
    ]
  },
  {
    id: 4,
    title: "Klaar om te beginnen!",
    description: "Start je koffie avontuur vandaag nog",
    icon: <Sparkles className="w-8 h-8 text-purple-600" />,
    emoji: "✨",
    details: [
      "🎯 Maak je eerste meetup in 2 minuten",
      "🌟 Alle je meetups op één plek beheren",
      "☕ Geniet van geweldige koffie en gesprekken"
    ]
  }
]

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)

  if (!isOpen) return null

  const currentStepData = onboardingSteps[currentStep]
  if (!currentStepData) return null // Safety check
  
  const isLastStep = currentStep === onboardingSteps.length - 1

  const handleNext = () => {
    if (isLastStep) {
      setShowConfetti(true)
      setTimeout(() => {
        onClose()
      }, 1500)
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSkip = () => {
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 text-4xl animate-bounce">🎉</div>
          <div className="absolute top-20 right-20 text-4xl animate-bounce delay-100">☕</div>
          <div className="absolute bottom-20 left-20 text-4xl animate-bounce delay-200">✨</div>
          <div className="absolute bottom-10 right-10 text-4xl animate-bounce delay-300">🌟</div>
        </div>
      )}
      
      <Card className="w-full max-w-2xl mx-4 shadow-2xl animate-bounceIn">
        <CardContent className="p-0">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-amber-500 to-orange-500 text-white p-6 rounded-t-lg">
            <button
              onClick={handleSkip}
              className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center">
              <div className="text-4xl sm:text-6xl mb-3 animate-pulse">{currentStepData.emoji}</div>
              <h2 className="text-xl sm:text-2xl font-bold mb-2">{currentStepData.title}</h2>
              <p className="text-amber-100 text-sm sm:text-base">{currentStepData.description}</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="px-4 sm:px-6 pt-4">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <span className="text-xs sm:text-sm text-gray-600">
                Stap {currentStep + 1} van {onboardingSteps.length}
              </span>
              <div className="flex space-x-2">
                {onboardingSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index <= currentStep 
                        ? 'bg-amber-500 scale-110' 
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="flex items-start space-x-3 sm:space-x-4 mb-4 sm:mb-6">
              <div className="flex-shrink-0 p-2 sm:p-3 bg-gray-100 rounded-full">
                {currentStepData.icon}
              </div>
              <div className="flex-1">
                <ul className="space-y-2 sm:space-y-3">
                  {currentStepData.details.map((detail, index) => (
                    <li 
                      key={index}
                      className="flex items-start space-x-2 sm:space-x-3 animate-slideInLeft"
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-gray-700 leading-relaxed">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Special content for last step */}
            {isLastStep && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">🎁</div>
                  <div>
                    <h3 className="font-semibold text-amber-800">Klaar om te starten?</h3>
                    <p className="text-sm text-amber-700">
                      Je eerste meetup is maar een paar klikken weg!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-0">
              <Button
                onClick={handlePrevious}
                variant="outline"
                disabled={currentStep === 0}
                className="disabled:opacity-50 order-2 sm:order-1 touch-target"
              >
                Vorige
              </Button>

              <Button
                onClick={handleSkip}
                variant="ghost"
                className="text-gray-500 order-3 sm:order-2 touch-target"
              >
                Overslaan
              </Button>

              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white order-1 sm:order-3 touch-target"
              >
                {isLastStep ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Laten we beginnen!</span>
                    <span className="sm:hidden">Beginnen!</span>
                  </>
                ) : (
                  <>
                    Volgende
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}