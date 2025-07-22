"use client"

interface NameInputProps {
  value: string
  onChange: (value: string) => void
}

export function NameInput({ value, onChange }: NameInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Hoe mogen we je noemen? ☕
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
        placeholder="Je naam of een leuke bijnaam"
      />
      <p className="text-sm text-gray-500 mt-1">
        Zo zullen andere koffie liefhebbers je zien
      </p>
    </div>
  )
} 