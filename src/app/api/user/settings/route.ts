import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 })
    }

    // Get user settings
    const { data: settings, error: settingsError } = await supabase
      .from('UserSettings')
      .select('*')
      .eq('userId', user.id)
      .single()

    if (settingsError && settingsError.code !== 'PGRST116') {
      console.error('Error fetching settings:', settingsError)
      return NextResponse.json({ error: 'Fout bij ophalen instellingen' }, { status: 500 })
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('UserProfile')
      .select('*')
      .eq('userId', user.id)
      .single()

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error fetching profile:', profileError)
      return NextResponse.json({ error: 'Fout bij ophalen profiel' }, { status: 500 })
    }

    return NextResponse.json({
      settings: settings || null,
      profile: profile || null,
      user: {
        id: user.id,
        email: user.email,
        nickname: user.user_metadata?.nickname || null
      }
    })

  } catch (error) {
    console.error('Error in settings GET:', error)
    return NextResponse.json({ error: 'Interne server fout' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 })
    }

    const body = await request.json()
    const { settings, profile, nickname } = body

    const updates = []

    // Update settings if provided
    if (settings) {
      const { error: settingsError } = await supabase
        .from('UserSettings')
        .upsert({
          userId: user.id,
          ...settings
        }, { onConflict: 'userId' })

      if (settingsError) {
        console.error('Error updating settings:', settingsError)
        return NextResponse.json({ error: 'Fout bij opslaan instellingen' }, { status: 500 })
      }
      updates.push('settings')
    }

    // Update profile if provided
    if (profile) {
      const { error: profileError } = await supabase
        .from('UserProfile')
        .upsert({
          userId: user.id,
          ...profile
        }, { onConflict: 'userId' })

      if (profileError) {
        console.error('Error updating profile:', profileError)
        return NextResponse.json({ error: 'Fout bij opslaan profiel' }, { status: 500 })
      }
      updates.push('profile')
    }

    // Update nickname if provided
    if (nickname !== undefined) {
      const { error: nicknameError } = await supabase
        .from('User')
        .update({ nickname })
        .eq('id', user.id)

      if (nicknameError) {
        console.error('Error updating nickname:', nicknameError)
        return NextResponse.json({ error: 'Fout bij opslaan bijnaam' }, { status: 500 })
      }
      updates.push('nickname')
    }

    return NextResponse.json({
      success: true,
      message: `Succesvol opgeslagen: ${updates.join(', ')}`
    })

  } catch (error) {
    console.error('Error in settings PUT:', error)
    return NextResponse.json({ error: 'Interne server fout' }, { status: 500 })
  }
} 