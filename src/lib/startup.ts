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

    // 3. Email service test
    logger.info('Testing email service...')
    try {
      const { sendEmail } = await import('./email')
      // Test email configuration without sending
      const resendKey = process.env.RESEND_API_KEY
      if (!resendKey || !resendKey.startsWith('re_')) {
        throw new Error('Invalid Resend API key')
      }
      result.checks.email = true
      logger.info('✅ Email service configuration valid')
    } catch (error) {
      result.success = false
      result.errors.push(`Email service test failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      logger.error('Email service test failed', error as Error)
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
        // Don't fail startup for Supabase permission issues in production
        if (process.env.NODE_ENV === 'production' && supabaseResult.error?.includes('permission denied')) {
          result.warnings.push(`Supabase connection warning: ${supabaseResult.error} (This may be due to database permissions)`)
          logger.warn('Supabase connection warning (permission denied)', { error: supabaseResult.error })
        } else {
          throw new Error(supabaseResult.error || 'Supabase connection failed')
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      // Don't fail startup for Supabase permission issues in production
      if (process.env.NODE_ENV === 'production' && errorMessage.includes('permission denied')) {
        result.warnings.push(`Supabase connection warning: ${errorMessage} (This may be due to database permissions)`)
        logger.warn('Supabase connection warning (permission denied)', error as Error)
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