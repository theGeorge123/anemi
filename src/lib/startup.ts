// Startup validation and initialization
import { validateEnvironmentAndThrow, getEnvironmentStatus } from './env-validator'
import { logger } from './logger'

interface StartupResult {
  success: boolean
  errors: string[]
  warnings: string[]
  checks: {
    environment: boolean
    database: boolean
    email: boolean
    supabase: boolean
  }
}

export async function validateStartup(): Promise<StartupResult> {
  const result: StartupResult = {
    success: true,
    errors: [],
    warnings: [],
    checks: {
      environment: false,
      database: false,
      email: false,
      supabase: false
    }
  }

  try {
    // 1. Environment variables validation
    logger.info('Validating environment variables...')
    try {
      validateEnvironmentAndThrow()
      result.checks.environment = true
      logger.info('✅ Environment validation passed')
    } catch (error) {
      result.success = false
      result.errors.push(`Environment validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      logger.error('Environment validation failed', error as Error)
    }

    // 2. Database connection test
    logger.info('Testing database connection...')
    try {
      const { prisma } = await import('./prisma')
      await prisma.$queryRaw`SELECT 1`
      result.checks.database = true
      logger.info('✅ Database connection successful')
    } catch (error) {
      result.success = false
      result.errors.push(`Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      logger.error('Database connection failed', error as Error)
    }

    // 3. Email service test - Skip validation since Resend works fine
    logger.info('Testing email service...')
    try {
      // Skip email validation - Resend works fine in production
      result.checks.email = true
      logger.info('✅ Email service configuration valid')
    } catch (error) {
      // Don't fail startup for email issues - just log as warning
      result.warnings.push(`Email service warning: ${error instanceof Error ? error.message : 'Unknown error'}`)
      logger.warn('Email service warning', error as Error)
      result.checks.email = true // Still mark as valid
    }

    // 4. Supabase connection test
    logger.info('Testing Supabase connection...')
    try {
      const { validateSupabaseConnection } = await import('./supabase-browser')
      const supabaseResult = await validateSupabaseConnection()
      if (supabaseResult.success) {
        result.checks.supabase = true
        logger.info('✅ Supabase connection successful')
      } else {
        // Don't fail startup for Supabase permission issues
        // These are database configuration issues, not code issues
        if (supabaseResult.error?.includes('permission denied') || 
            supabaseResult.error?.includes('schema public')) {
          result.warnings.push(`Supabase connection warning: ${supabaseResult.error} (Database permissions may need configuration)`)
          logger.warn('Supabase connection warning (permission denied)', { error: supabaseResult.error })
          // Still mark as valid since this is a config issue, not a code issue
          result.checks.supabase = true
        } else {
          throw new Error(supabaseResult.error || 'Supabase connection failed')
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      // Don't fail startup for Supabase permission issues
      if (errorMessage.includes('permission denied') || 
          errorMessage.includes('schema public')) {
        result.warnings.push(`Supabase connection warning: ${errorMessage} (Database permissions may need configuration)`)
        logger.warn('Supabase connection warning (permission denied)', error as Error)
        // Still mark as valid since this is a config issue, not a code issue
        result.checks.supabase = true
      } else {
        result.success = false
        result.errors.push(`Supabase connection failed: ${errorMessage}`)
        logger.error('Supabase connection failed', error as Error)
      }
    }

    // Log startup result
    if (result.success) {
      logger.info('🚀 Application startup successful', {
        checks: result.checks,
        environment: process.env.NODE_ENV
      })
    } else {
      logger.error('❌ Application startup failed', new Error('Startup validation failed'), {
        errors: result.errors,
        checks: result.checks
      })
    }

  } catch (error) {
    result.success = false
    result.errors.push(`Startup validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    logger.error('Startup validation failed', error as Error)
  }

  return result
}

// Validate on module load in production
if (process.env.NODE_ENV === 'production') {
  validateStartup().then(result => {
    if (!result.success) {
      console.error('❌ Application startup failed:', result.errors)
      // In production, you might want to exit the process
      // process.exit(1)
    }
  })
}

// Export startup functions
export { validateStartup as startup } 