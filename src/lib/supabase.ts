import { createClient } from '@supabase/supabase-js';
import { SecureStorage } from './secure-storage';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase configuration error:');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Set' : '❌ Missing');
}

// Only create Supabase client if environment variables are available
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storage: SecureStorage,
      },
    })
  : null;

// Server-side Supabase client with service role key
export const supabaseAdmin = supabaseUrl && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

// Auth helpers with better error handling
export const getSession = async () => {
  if (!supabase) {
    console.error('❌ Supabase client not configured');
    return null;
  }
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('❌ Error getting session:', error);
      return null;
    }
    return session;
  } catch (error) {
    console.error('❌ Unexpected error getting session:', error);
    return null;
  }
};

export const getUser = async () => {
  if (!supabase) {
    console.error('❌ Supabase client not configured');
    return null;
  }
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('❌ Error getting user:', error);
      return null;
    }
    return user;
  } catch (error) {
    console.error('❌ Unexpected error getting user:', error);
    return null;
  }
};

export const signOut = async () => {
  if (!supabase) {
    console.error('❌ Supabase client not configured');
    return { error: new Error('Supabase not configured') };
  }
  
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('❌ Error signing out:', error);
    }
    return { error };
  } catch (error) {
    console.error('❌ Unexpected error signing out:', error);
    return { error: error as Error };
  }
};

// Database helpers with better error handling
export const getProfile = async (userId: string) => {
  if (!supabase) {
    console.error('❌ Supabase client not configured');
    return { data: null, error: new Error('Supabase not configured') };
  }
  
  try {
    const { data, error } = await supabase
      .from('User')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('❌ Error getting profile:', error);
    }
    
    return { data, error };
  } catch (error) {
    console.error('❌ Unexpected error getting profile:', error);
    return { data: null, error: error as Error };
  }
};

export const updateProfile = async (userId: string, updates: any) => {
  if (!supabase) {
    console.error('❌ Supabase client not configured');
    return { data: null, error: new Error('Supabase not configured') };
  }
  
  try {
    const { data, error } = await supabase
      .from('User')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('❌ Error updating profile:', error);
    }
    
    return { data, error };
  } catch (error) {
    console.error('❌ Unexpected error updating profile:', error);
    return { data: null, error: error as Error };
  }
}; 