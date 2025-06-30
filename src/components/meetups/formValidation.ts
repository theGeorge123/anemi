import { type City } from '@/constants/cities'

export interface FormData {
  name: string
  email: string
  city: City
  dates: string[]
  times: string[] // Multiple times
  dateTimePreferences: Record<string, string[]> // Date -> Times mapping
  priceRange: string
}

export function validateForm(formData: FormData): string | null {
  if (!formData.name.trim()) {
    return 'Please enter your name'
  }
  
  if (!formData.email.trim()) {
    return 'Please enter your email'
  }
  
  if (!formData.email.includes('@')) {
    return 'Please enter a valid email address'
  }
  
  if (!formData.city) {
    return 'Please select a city'
  }
  
  if (formData.dates.length === 0) {
    return 'Please select at least one date'
  }
  
  if (formData.times.length === 0) {
    return 'Please select at least one time'
  }
  
  return null
} 