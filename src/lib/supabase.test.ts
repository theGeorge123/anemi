import { createClient } from '@supabase/supabase-js'

describe('Supabase Client', () => {
  it('should create a client with environment variables', () => {
    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    expect(client).toBeDefined()
  })
}) 