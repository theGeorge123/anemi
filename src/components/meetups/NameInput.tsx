"use client"

interface NameInputProps {
  value: string
  onChange: (value: string) => void
}

export function NameInput({ value, onChange }: NameInputProps) {
  return (
    <div className="space-y-3">
      <label className="block text-base sm:text-lg font-medium text-gray-700 mb-3">
        Hoe mogen we je noemen? ☕
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 sm:py-4 text-base sm:text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
        placeholder="Je naam of een leuke bijnaam"
        autoComplete="name"
        autoFocus
      />
      <p className="text-sm sm:text-base text-gray-500 mt-2">
        Zo zullen andere koffie liefhebbers je zien
      </p>
    </div>
  )
} 