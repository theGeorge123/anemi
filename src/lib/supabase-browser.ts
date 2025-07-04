import { createBrowserClient } from '@supabase/ssr'

// Check if we're in a browser environment and have the required env vars
const isBrowser = typeof window !== 'undefined'
const hasEnvVars = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = isBrowser && hasEnvVars 
  ? createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  : null 