"use client"

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface EmailInputProps {
  value: string
  onChange: (value: string) => void
}

export function EmailInput({ value, onChange }: EmailInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="email" className="text-sm sm:text-base font-medium">
        Je E-mail
      </Label>
      <Input
        id="email"
        type="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Voer je e-mail in"
        className="w-full"
        required
      />
      <p className="text-xs text-gray-600">
        Dit wordt gebruikt om je meetup uitnodigingen te versturen
      </p>
    </div>
  )
} 