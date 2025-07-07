import { createClient } from '@supabase/supabase-js';
import { SecureStorage } from './secure-storage';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

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

// Auth helpers
export const getSession = async () => {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

export const getUser = async () => {
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const signOut = async () => {
  if (!supabase) return { error: new Error('Supabase not configured') };
  const { error } = await supabase.auth.signOut();
  return { error };
};

// Database helpers
export const getProfile = async (userId: string) => {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };
  const { data, error } = await supabase
    .from('User')
    .select('*')
    .eq('id', userId)
    .single();
  
  return { data, error };
};

export const updateProfile = async (userId: string, updates: any) => {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };
  const { data, error } = await supabase
    .from('User')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  return { data, error };
}; 