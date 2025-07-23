// Environment variable validator
interface EnvironmentConfig {
  name: string
  value: string | undefined
  required: boolean
  description: string
  validation?: (value: string) => boolean
}

const requiredEnvVars: EnvironmentConfig[] = [
  {
    name: 'NEXT_PUBLIC_SITE_URL',
    value: process.env.NEXT_PUBLIC_SITE_URL,
    required: true,
    description: 'Site URL for email links and invites',
    validation: (value) => {
      try {
        new URL(value)
        return true
      } catch {
        return false
      }
    }
  },
  {
    name: 'NEXT_PUBLIC_SUPABASE_URL',
    value: process.env.NEXT_PUBLIC_SUPABASE_URL,
    required: true,
    description: 'Supabase project URL',
    validation: (value) => value.startsWith('https://')
  },
  {
    name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    required: true,
    description: 'Supabase anonymous key',
    validation: (value) => value.length > 50
  },

  {
    name: 'EMAIL_FROM',
    value: process.env.EMAIL_FROM,
    required: false,
    description: 'Default sender email (optional)',
    validation: (value) => {
      if (!value) return true // Optional
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    }
  }
]

interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
  missing: string[]
  invalid: string[]
}

export function validateEnvironment(): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    missing: [],
    invalid: []
  }

  for (const config of requiredEnvVars) {
    const { name, value, required, description, validation } = config

    // Check if required variable is missing
    if (required && (!value || value === 'undefined' || value === '')) {
      result.valid = false
      result.errors.push(`Missing required environment variable: ${name} - ${description}`)
      result.missing.push(name)
      continue
    }

    // Check if optional variable is missing
    if (!required && (!value || value === 'undefined' || value === '')) {
      result.warnings.push(`Optional environment variable not set: ${name} - ${description}`)
      continue
    }

    // Validate value format if validation function exists
    if (value && validation && !validation(value)) {
      result.valid = false
      result.errors.push(`Invalid environment variable format: ${name} - ${description}`)
      result.invalid.push(name)
    }
  }

  return result
}

export function validateEnvironmentAndThrow(): void {
  const result = validateEnvironment()
  
  if (!result.valid) {
    const errorMessage = `Environment validation failed:\n${result.errors.join('\n')}`
    throw new Error(errorMessage)
  }
}

export function getEnvironmentStatus(): {
  valid: boolean
  missing: string[]
  invalid: string[]
  warnings: string[]
} {
  const result = validateEnvironment()
  
  return {
    valid: result.valid,
    missing: result.missing,
    invalid: result.invalid,
    warnings: result.warnings
  }
}

// Validate on module load in development
if (process.env.NODE_ENV === 'development') {
  const result = validateEnvironment()
  
  if (result.errors.length > 0) {
    console.error('❌ Environment validation errors:')
    result.errors.forEach(error => console.error(`  - ${error}`))
  }
  
  if (result.warnings.length > 0) {
    console.warn('⚠️ Environment validation warnings:')
    result.warnings.forEach(warning => console.warn(`  - ${warning}`))
  }
  
  if (result.valid) {
    console.log('✅ Environment validation passed')
  }
}

// Export validation functions
export { validateEnvironment as validate } 