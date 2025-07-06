import { useToaster } from './toaster'

export function toast(toast: {
  title: string
  description?: string
  type?: 'default' | 'success' | 'error' | 'warning'
  duration?: number
}) {
  // This is a simple wrapper around the existing toaster
  // In a real implementation, you'd want to use a more sophisticated toast system
  console.log('Toast:', toast)
}

export function useToast() {
  return useToaster()
} 