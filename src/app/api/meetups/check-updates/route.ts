import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    // Get user ID from query params or headers
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    logger.info('Checking meetup updates for user', { userId }, 'BACKGROUND_AGENT');

    const updates = await checkMeetupUpdates(userId);

    return NextResponse.json(updates);
  } catch (error) {
    logger.error('Error checking meetup updates', error as Error, {}, 'BACKGROUND_AGENT');
    return NextResponse.json(
      { error: 'Failed to check updates' },
      { status: 500 }
    );
  }
}

async function checkMeetupUpdates(userId: string) {
  const updates = [];

  try {
    // Check for new invitations
    if (!supabaseAdmin) {
      throw new Error('Supabase admin client not available');
    }

    const { data: newInvitations, error: invitationsError } = await supabaseAdmin
      .from('meetup_invites')
      .select(`
        *,
        meetup:meetups(*),
        inviter:users!meetup_invites_created_by_fkey(*)
      `)
      .eq('invitee_id', userId)
      .eq('status', 'PENDING')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()); // Last 24 hours

    if (invitationsError) {
      logger.error('Error fetching new invitations', invitationsError, {}, 'BACKGROUND_AGENT');
    } else if (newInvitations && newInvitations.length > 0) {
      for (const invitation of newInvitations) {
        updates.push({
          type: 'new_invite',
          meetup: invitation.meetup,
          user: invitation.inviter,
          invitation: invitation,
        });
      }
    }

    // Check for upcoming meetup reminders
    const { data: upcomingMeetups, error: remindersError } = await supabaseAdmin
      .from('meetups')
      .select(`
        *,
        invites:meetup_invites(*)
      `)
      .eq('status', 'SCHEDULED')
      .gte('scheduled_at', new Date().toISOString())
      .lte('scheduled_at', new Date(Date.now() + 60 * 60 * 1000).toISOString()); // Next hour

    if (remindersError) {
      logger.error('Error fetching upcoming meetups', remindersError, {}, 'BACKGROUND_AGENT');
    } else if (upcomingMeetups && upcomingMeetups.length > 0) {
      for (const meetup of upcomingMeetups) {
        // Check if user is invited to this meetup
        const isInvited = meetup.invites?.some(
          (invite: any) => invite.invitee_id === userId
        );

        if (isInvited) {
          updates.push({
            type: 'meetup_reminder',
            meetup: meetup,
          });
        }
      }
    }

    // Check for meetup updates
    const { data: updatedMeetups, error: updatesError } = await supabaseAdmin
      .from('meetups')
      .select(`
        *,
        invites:meetup_invites(*)
      `)
      .eq('status', 'SCHEDULED')
      .gte('updated_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
      .not('updated_at', 'eq', 'created_at'); // Only updated meetups

    if (updatesError) {
      logger.error('Error fetching updated meetups', updatesError, {}, 'BACKGROUND_AGENT');
    } else if (updatedMeetups && updatedMeetups.length > 0) {
      for (const meetup of updatedMeetups) {
        // Check if user is invited to this meetup
        const isInvited = meetup.invites?.some(
          (invite: any) => invite.invitee_id === userId
        );

        if (isInvited) {
          updates.push({
            type: 'meetup_updated',
            meetup: meetup,
          });
        }
      }
    }

    logger.info('Meetup updates check completed', {
      userId,
      updatesCount: updates.length,
      newInvitations: newInvitations?.length || 0,
      upcomingMeetups: upcomingMeetups?.length || 0,
      updatedMeetups: updatedMeetups?.length || 0,
    }, 'BACKGROUND_AGENT');

    return updates;
  } catch (error) {
    logger.error('Error in checkMeetupUpdates', error as Error, { userId }, 'BACKGROUND_AGENT');
    throw error;
  }
} 