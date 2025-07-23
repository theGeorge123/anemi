import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let supabaseClient: SupabaseClient | null = null

// Clear stale auth tokens for production domains
if (typeof window !== 'undefined') {
  const currentDomain = window.location.hostname
  if (currentDomain !== 'localhost' && currentDomain !== '127.0.0.1') {
    // Clear any localhost tokens that might be stored
    Object.keys(localStorage).forEach(key => {
      if (key.includes('supabase') && key.includes('localhost')) {
        localStorage.removeItem(key)
      }
    })
    
    // Clear cookies that might be from localhost
    document.cookie.split(';').forEach(cookie => {
      const [name] = cookie.split('=')
      if (name && name.trim().includes('supabase') && name.trim().includes('localhost')) {
        document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
      }
    })
  }
}

export function getSupabaseClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Validate environment variables
  if (!url || !key) {
    console.error('❌ getSupabaseClient: Missing environment variables')
    throw new Error('Missing Supabase environment variables')
  }

  // Validate URL format
  if (!url.startsWith('https://')) {
    console.error('❌ Invalid Supabase URL format. Should start with https://')
    throw new Error('Invalid Supabase URL format')
  }

  // Validate key length (basic check)
  if (key.length < 50) {
    console.error('❌ Supabase key seems too short. Expected a long string.')
    throw new Error('Invalid Supabase key format')
  }

  // Return existing client if available
  if (supabaseClient) {
    return supabaseClient
  }

  // Create new client
  try {
    supabaseClient = createClient(url, key, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })

    return supabaseClient
  } catch (error) {
    console.error('❌ getSupabaseClient: Error creating client:', error)
    throw new Error('Failed to create Supabase client')
  }
}

export async function validateSupabaseConnection(): Promise<{ success: boolean; error?: string; details?: any }> {
  try {
    const supabase = getSupabaseClient()
    
    // Test basic connection by getting session
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      return {
        success: false,
        error: 'Supabase connection validation failed',
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
      error: 'Unexpected error validating Supabase connection',
      details: { message: error instanceof Error ? error.message : 'Unknown error', stack: error instanceof Error ? error.stack : undefined }
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

// Clear stale tokens function
export function clearStaleTokens(): void {
  if (typeof window === 'undefined') return

  // Clear localStorage items
  Object.keys(localStorage).forEach(key => {
    if (key.includes('supabase') && (key.includes('localhost') || key.includes('127.0.0.1'))) {
      localStorage.removeItem(key)
    }
  })

  // Clear cookies
  document.cookie.split(';').forEach(cookie => {
    const [name] = cookie.split('=')
    const cookieName = name?.trim()
    if (cookieName && cookieName.includes('supabase') && (cookieName.includes('localhost') || cookieName.includes('127.0.0.1'))) {
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    }
  })
} 