import { createClient } from '@supabase/supabase-js'

// Create a singleton instance
let supabaseClient: any = null;

export function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  console.log('🔍 getSupabaseClient called:')
  console.log('URL exists:', !!url)
  console.log('Key exists:', !!key)
  console.log('URL starts with https:', url?.startsWith('https://'))
  console.log('Key length:', key?.length)
  console.log('Is Vercel environment:', !!process.env.VERCEL_URL)
  console.log('NODE_ENV:', process.env.NODE_ENV)
  
  if (!url || !key) {
    console.error('❌ getSupabaseClient: Missing environment variables');
    console.error('NEXT_PUBLIC_SUPABASE_URL:', url ? '✅ Set' : '❌ Missing');
    console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', key ? '✅ Set' : '❌ Missing');
    console.error('VERCEL_URL:', process.env.VERCEL_URL);
    console.error('VERCEL_ENV:', process.env.VERCEL_ENV);
    return null;
  }

  // Validate URL format
  if (!url.startsWith('https://')) {
    console.error('❌ Invalid Supabase URL format. Should start with https://');
    return null;
  }

  // Validate key format (should be a long string)
  if (key.length < 100) {
    console.error('❌ Supabase key seems too short. Expected a long string.');
    return null;
  }
  
  // Return existing client if already created
  if (supabaseClient) {
    console.log('✅ Returning existing Supabase client');
    return supabaseClient;
  }
  
  try {
    console.log('🔧 Creating new Supabase client...');
    console.log('🔧 URL:', url);
    console.log('🔧 Key starts with:', key.substring(0, 10) + '...');
    
    supabaseClient = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
      global: {
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`,
        },
      },
    });
    
    console.log('✅ Supabase client created successfully');
    return supabaseClient;
  } catch (error) {
    console.error('❌ getSupabaseClient: Error creating client:', error);
    return null;
  }
}

// Helper function to validate Supabase connection
export async function validateSupabaseConnection() {
  const client = getSupabaseClient();
  if (!client) {
    return { valid: false, error: 'Supabase client not configured' };
  }
  
  try {
    console.log('🔍 Testing Supabase connection...');
    const { data, error } = await client.auth.getSession();
    if (error) {
      console.error('❌ Supabase connection validation failed:', error);
      return { valid: false, error: error.message };
    }
    
    console.log('✅ Supabase connection validated successfully');
    return { valid: true, session: data.session };
  } catch (error) {
    console.error('❌ Unexpected error validating Supabase connection:', error);
    return { valid: false, error: 'Unexpected error' };
  }
}

// Specific auth test function
export async function testSupabaseAuth() {
  const client = getSupabaseClient();
  if (!client) {
    return { valid: false, error: 'Supabase client not configured' };
  }
  
  try {
    console.log('🔍 Testing Supabase auth specifically...');
    
    // Test 1: Check if we can create a client
    console.log('✅ Client created successfully');
    
    // Test 2: Try to get session (this is what's failing)
    const { data, error } = await client.auth.getSession();
    console.log('Session data:', data);
    console.log('Session error:', error);
    
    if (error) {
      console.error('❌ Auth test failed:', error);
      return { 
        valid: false, 
        error: error.message,
        details: {
          code: error.status,
          message: error.message,
          name: error.name
        }
      };
    }
    
    console.log('✅ Auth test passed');
    return { valid: true, session: data.session };
  } catch (error) {
    console.error('❌ Unexpected error in auth test:', error);
    return { valid: false, error: 'Unexpected error in auth test' };
  }
} 