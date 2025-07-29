import { createClient } from '@supabase/supabase-js'
import { logger } from './logger'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

interface SupabaseConnectionResult {
  success: boolean
  error?: string
  details?: any
}

export function getSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    logger.error('Missing Supabase environment variables', new Error('Missing Supabase environment variables'), {
      supabaseUrl: !!supabaseUrl,
      supabaseAnonKey: !!supabaseAnonKey
    }, 'SUPABASE')
    throw new Error('Missing Supabase environment variables')
  }

  if (!supabaseUrl.startsWith('https://')) {
    logger.error('Invalid Supabase URL format', new Error('Invalid Supabase URL format'), { url: supabaseUrl }, 'SUPABASE')
    throw new Error('Invalid Supabase URL format. Should start with https://')
  }

  if (supabaseAnonKey.length < 50) {
    logger.error('Supabase key seems too short', new Error('Supabase key seems too short'), { keyLength: supabaseAnonKey.length }, 'SUPABASE')
    throw new Error('Supabase key seems too short. Expected a long string.')
  }

  try {
    const client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })

    logger.info('Supabase client created successfully', {
      url: supabaseUrl,
      hasKey: !!supabaseAnonKey
    }, 'SUPABASE')

    return client
  } catch (error) {
    logger.error('Error creating Supabase client', error as Error, {
      url: supabaseUrl,
      hasKey: !!supabaseAnonKey
    }, 'SUPABASE')
    throw error
  }
}

export async function validateSupabaseConnection(): Promise<SupabaseConnectionResult> {
  try {
    const client = getSupabaseClient()
    
    // Test the connection by checking auth instead of database queries
    // This avoids permission issues with the database schema
    const { data, error } = await client.auth.getSession()
    
    if (error) {
      logger.error('Supabase connection test failed', error, {}, 'SUPABASE')
      return {
        success: false,
        error: error.message,
        details: error
      }
    }

    logger.info('Supabase connection test successful', {
      hasSession: !!data.session,
      userId: data.session?.user?.id
    }, 'SUPABASE')

    return {
      success: true,
      details: { session: data.session }
    }
  } catch (error) {
    logger.error('Supabase connection validation failed', error as Error, {}, 'SUPABASE')
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    }
  }
}

export async function testSupabaseAuth(): Promise<{ success: boolean; error?: string; details?: any }> {
  try {
    const supabase = getSupabaseClient()
    
    // Test auth specifically
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      return {
        success: false,
        error: 'Auth test failed',
        details: { message: error.message, stack: error.stack }
      }
    }

    return {
      success: true,
      details: { session: data.session }
    }
  } catch (error) {
    return {
      success: false,
      error: 'Unexpected error in auth test',
      details: { message: error instanceof Error ? error.message : 'Unknown error', stack: error instanceof Error ? error.stack : undefined }
    }
  }
}

/**
 * Clear all stale Supabase tokens from localStorage and cookies
 * This helps fix authentication issues when switching between localhost and production
 */
export function clearStaleTokens(): void {
  if (typeof window === 'undefined') return

  console.log('🧹 Clearing stale Supabase tokens...')

  // Clear localStorage items
  const localStorageKeys = Object.keys(localStorage)
  const supabaseKeys = localStorageKeys.filter(key => 
    key.startsWith('sb-') || 
    key.includes('supabase') || 
    key.includes('auth')
  )
  
  supabaseKeys.forEach(key => {
    console.log(`🗑️ Removing localStorage key: ${key}`)
    localStorage.removeItem(key)
  })

  // Clear cookies
  const cookies = document.cookie.split(';')
  cookies.forEach(cookie => {
    const [name] = cookie.trim().split('=')
    if (name && (name.startsWith('sb-') || name.includes('supabase') || name.includes('auth'))) {
      console.log(`🗑️ Removing cookie: ${name}`)
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    }
  })

  // Clear sessionStorage
  const sessionStorageKeys = Object.keys(sessionStorage)
  const sessionSupabaseKeys = sessionStorageKeys.filter(key => 
    key.startsWith('sb-') || 
    key.includes('supabase') || 
    key.includes('auth')
  )
  
  sessionSupabaseKeys.forEach(key => {
    console.log(`🗑️ Removing sessionStorage key: ${key}`)
    sessionStorage.removeItem(key)
  })

  console.log(`✅ Cleared ${supabaseKeys.length} localStorage items, ${sessionSupabaseKeys.length} sessionStorage items, and related cookies`)
}

/**
 * Get count of existing Supabase tokens
 */
export function getTokenCount(): number {
  if (typeof window === 'undefined') return 0

  const localStorageKeys = Object.keys(localStorage).filter(key => 
    key.startsWith('sb-') || 
    key.includes('supabase') || 
    key.includes('auth')
  )
  
  const sessionStorageKeys = Object.keys(sessionStorage).filter(key => 
    key.startsWith('sb-') || 
    key.includes('supabase') || 
    key.includes('auth')
  )

  const cookies = document.cookie.split(';').filter(cookie => {
    const [name] = cookie.trim().split('=')
    return name && (name.startsWith('sb-') || name.includes('supabase') || name.includes('auth'))
  })

  return localStorageKeys.length + sessionStorageKeys.length + cookies.length
} 