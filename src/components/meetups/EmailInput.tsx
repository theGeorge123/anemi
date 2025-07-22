"use client"

interface EmailInputProps {
  value: string
  onChange: (value: string) => void
}

export function EmailInput({ value, onChange }: EmailInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Je E-mail
      </label>
      <input
        type="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
        placeholder="Voer je e-mail in"
      />
    </div>
  )
} 