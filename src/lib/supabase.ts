import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Server-side Supabase client with service role key
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Auth helpers
export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

export const getUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// Database helpers
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('User')
    .select('*')
    .eq('id', userId)
    .single();
  
  return { data, error };
};

export const updateProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('User')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  return { data, error };
}; 