import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { generateRandomNickname, generateNicknameFromEmail } from '@/lib/nickname-generator';

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { nickname: true, email: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      nickname: user.nickname,
      email: user.email 
    });

  } catch (error) {
    console.error('Error getting nickname:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { nickname } = await request.json();

    if (!nickname || typeof nickname !== 'string' || nickname.trim().length === 0) {
      return NextResponse.json({ error: 'Nickname is required' }, { status: 400 });
    }

    if (nickname.length > 50) {
      return NextResponse.json({ error: 'Nickname too long' }, { status: 400 });
    }

    // Update user's nickname
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { nickname: nickname.trim() },
      select: { nickname: true }
    });

    return NextResponse.json({ 
      nickname: updatedUser.nickname,
      message: 'Nickname updated successfully' 
    });

  } catch (error) {
    console.error('Error updating nickname:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user to check if they already have a nickname
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { nickname: true, email: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Generate new nickname
    let newNickname: string;
    
    if (user.nickname) {
      // If user already has a nickname, generate a completely random one
      newNickname = generateRandomNickname();
    } else {
      // If user doesn't have a nickname, generate one based on their email
      newNickname = generateNicknameFromEmail(user.email || '');
    }

    // Update user's nickname
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { nickname: newNickname },
      select: { nickname: true }
    });

    return NextResponse.json({ 
      nickname: updatedUser.nickname,
      message: 'New nickname generated successfully' 
    });

  } catch (error) {
    console.error('Error generating nickname:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 