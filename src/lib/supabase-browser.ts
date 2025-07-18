import { createClient } from '@supabase/supabase-js'

// Create a singleton instance
let supabaseClient: any = null;

export function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    console.error('getSupabaseClient: Missing environment variables')
    return null;
  }
  
  // Return existing client if already created
  if (supabaseClient) {
    return supabaseClient;
  }
  
  try {
    supabaseClient = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    return supabaseClient;
  } catch (error) {
    console.error('getSupabaseClient: Error creating client:', error)
    return null;
  }
} 