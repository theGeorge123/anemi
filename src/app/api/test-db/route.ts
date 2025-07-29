import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const testInsert = searchParams.get('testInsert') === 'true'
    const testUpsert = searchParams.get('testUpsert') === 'true'

    if (testUpsert) {
      // Test the exact same upsert operation as in create-user
      console.log('🧪 Testing upsert operation (same as create-user)...')
      
      const testUserId = 'test-upsert-' + Date.now()
      const testEmail = 'test-upsert-' + Date.now() + '@example.com'
      const testNickname = 'test-nickname-' + Date.now()
      
      try {
        console.log('🔧 Attempting to save user to database...')
        console.log('   User ID:', testUserId)
        console.log('   User Email:', testEmail)
        console.log('   Nickname:', testNickname)
        
        const result = await prisma.user.upsert({
          where: { id: testUserId },
          update: { 
            nickname: testNickname,
            updatedAt: new Date()
          },
          create: {
            id: testUserId,
            email: testEmail,
            nickname: testNickname,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        })
        
        console.log('✅ User saved to database successfully:', result)
        
        // Clean up - delete the test user
        await prisma.user.delete({
          where: { id: testUserId }
        })
        
        return NextResponse.json({
          success: true,
          message: 'Upsert operation test successful',
          testUser: result
        })
      } catch (upsertError) {
        console.error('❌ Upsert operation failed:', upsertError)
        console.error('❌ Error details:', {
          message: upsertError instanceof Error ? upsertError.message : 'Unknown error',
          stack: upsertError instanceof Error ? upsertError.stack : undefined,
          name: upsertError instanceof Error ? upsertError.name : 'Unknown'
        })
        return NextResponse.json({
          success: false,
          error: 'Upsert operation failed',
          details: upsertError instanceof Error ? upsertError.message : 'Unknown error'
        }, { status: 500 })
      }
    }

    if (testInsert) {
      // Test direct database insert
      console.log('🧪 Testing direct database insert...')
      
      const testUserId = 'test-user-' + Date.now()
      const testEmail = 'test-' + Date.now() + '@example.com'
      
      try {
        const result = await prisma.user.create({
          data: {
            id: testUserId,
            email: testEmail,
            nickname: 'test-nickname',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        })
        
        console.log('✅ Direct insert successful:', result)
        
        // Clean up - delete the test user
        await prisma.user.delete({
          where: { id: testUserId }
        })
        
        return NextResponse.json({
          success: true,
          message: 'Direct database insert test successful',
          testUser: result
        })
      } catch (insertError) {
        console.error('❌ Direct insert failed:', insertError)
        return NextResponse.json({
          success: false,
          error: 'Direct database insert failed',
          details: insertError instanceof Error ? insertError.message : 'Unknown error'
        }, { status: 500 })
      }
    }

    if (!userId) {
      return NextResponse.json({ 
        error: 'User ID is required' 
      }, { status: 400 })
    }

    console.log('🔍 Testing database for user ID:', userId)

    // Check if user exists in database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        nickname: true,
        createdAt: true,
        updatedAt: true
      }
    })

    console.log('📊 Database query result:', user)

    if (user) {
      return NextResponse.json({
        userFound: true,
        user: user
      })
    } else {
      return NextResponse.json({
        userFound: false,
        user: null
      })
    }

  } catch (error) {
    console.error('❌ Database test error:', error)
    return NextResponse.json({ 
      error: 'Database test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 