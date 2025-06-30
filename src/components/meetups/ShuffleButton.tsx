"use client"

import { Button } from '@/components/ui/button'
import { Shuffle } from 'lucide-react'

interface ShuffleButtonProps {
  isLoading: boolean
  onClick: () => void
}

export function ShuffleButton({ isLoading, onClick }: ShuffleButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3"
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Finding Coffee Shop...
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Shuffle className="w-4 h-4" />
          Shuffle Coffee Shop
        </div>
      )}
    </Button>
  )
} 