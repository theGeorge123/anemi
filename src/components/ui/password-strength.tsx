"use client"

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Shield, Zap, Coffee } from 'lucide-react'

interface PasswordStrengthProps {
  password: string
  className?: string
}

interface StrengthLevel {
  level: 'weak' | 'medium' | 'strong' | 'excellent'
  score: number
  color: string
  bgColor: string
  message: string
  icon: React.ReactNode
  emoji: string
}

export function PasswordStrength({ password, className = '' }: PasswordStrengthProps) {
  const [strength, setStrength] = useState<StrengthLevel>({
    level: 'weak',
    score: 0,
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    message: 'Begin maar met typen...',
    icon: <XCircle className="w-4 h-4" />,
    emoji: '☕'
  })

  useEffect(() => {
    if (!password) {
      setStrength({
        level: 'weak',
        score: 0,
        color: 'text-gray-400',
        bgColor: 'bg-gray-50',
        message: 'Begin maar met typen...',
        icon: <Coffee className="w-4 h-4" />,
        emoji: '☕'
      })
      return
    }

    const calculateStrength = (): StrengthLevel => {
      let score = 0
      const checks = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        numbers: /\d/.test(password),
        symbols: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        noCommon: !['password', '123456', 'qwerty', 'admin', 'coffee', 'koffie'].some(common => 
          password.toLowerCase().includes(common)
        ),
        noSequential: !/(.)\1{2,}/.test(password) && !/(.)(.)\1\2/.test(password),
        mixed: /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password)
      }

      // Basis punten
      if (checks.length) score += 10
      if (checks.lowercase) score += 5
      if (checks.uppercase) score += 5
      if (checks.numbers) score += 10
      if (checks.symbols) score += 15
      if (checks.noCommon) score += 10
      if (checks.noSequential) score += 5
      if (checks.mixed) score += 10

      // Bonus voor lengte
      if (password.length >= 12) score += 10
      if (password.length >= 16) score += 5

      // Bepaal level en bericht
      if (score < 30) {
        return {
          level: 'weak',
          score,
          color: 'text-red-500',
          bgColor: 'bg-red-50',
          message: 'Dit wachtwoord is echt te makkelijk te raden! 😅',
          icon: <XCircle className="w-4 h-4" />,
          emoji: '😅'
        }
      } else if (score < 50) {
        return {
          level: 'medium',
          score,
          color: 'text-orange-500',
          bgColor: 'bg-orange-50',
          message: 'Hmm, dit begint ergens op te lijken... 🤔',
          icon: <AlertTriangle className="w-4 h-4" />,
          emoji: '🤔'
        }
      } else if (score < 70) {
        return {
          level: 'strong',
          score,
          color: 'text-green-500',
          bgColor: 'bg-green-50',
          message: 'Dit is een goede! 👍',
          icon: <CheckCircle className="w-4 h-4" />,
          emoji: '👍'
        }
      } else {
        return {
          level: 'excellent',
          score,
          color: 'text-blue-500',
          bgColor: 'bg-blue-50',
          message: 'Dit zou ik nooit raden! 🔒',
          icon: <Shield className="w-4 h-4" />,
          emoji: '🔒'
        }
      }
    }

    setStrength(calculateStrength())
  }, [password])

  const getProgressColor = () => {
    switch (strength.level) {
      case 'weak': return 'bg-red-500'
      case 'medium': return 'bg-orange-500'
      case 'strong': return 'bg-green-500'
      case 'excellent': return 'bg-blue-500'
      default: return 'bg-gray-300'
    }
  }

  const getProgressWidth = () => {
    const maxScore = 100
    return Math.min((strength.score / maxScore) * 100, 100)
  }

  if (!password) return null

  return (
    <div className={`space-y-3 animate-in fade-in duration-300 ${className}`}>
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all duration-500 ease-out ${getProgressColor()}`}
          style={{ width: `${getProgressWidth()}%` }}
        />
      </div>

      {/* Strength Indicator */}
      <div className={`p-3 rounded-lg border transition-all duration-300 ${strength.bgColor} border-current hover:scale-105`}>
        <div className="flex items-center gap-2">
          <span className={strength.color}>
            {strength.icon}
          </span>
          <span className={`text-sm font-medium ${strength.color}`}>
            {strength.message}
          </span>
          <span className="text-lg">{strength.emoji}</span>
        </div>
      </div>

      {/* Score Display */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Sterkte: {strength.score}/100</span>
        <span className="flex items-center gap-1">
          <Zap className="w-3 h-3" />
          {strength.level === 'excellent' && 'Onkraakbaar!'}
          {strength.level === 'strong' && 'Veilig'}
          {strength.level === 'medium' && 'Redelijk'}
          {strength.level === 'weak' && 'Zwak'}
        </span>
      </div>
    </div>
  )
} 