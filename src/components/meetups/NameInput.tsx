"use client"

interface NameInputProps {
  value: string
  onChange: (value: string) => void
}

export function NameInput({ value, onChange }: NameInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Your Name
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
        placeholder="Enter your name"
      />
    </div>
  )
} 