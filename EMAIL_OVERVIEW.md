# 📧 Email Functions Overview

## Email Functions in `src/lib/email.ts`

### 1. 📧 Meetup Cancellation Email
- **Function**: `sendMeetupCancellation(to, meetupTitle, meetupDate, reason)`
- **Used in**: 
  - `/api/meetups/[id]/route.ts` (DELETE) - when meetup is deleted
  - `/api/debug-email/route.ts` - for testing
- **Purpose**: Notify invitee when meetup is cancelled
- **Status**: ✅ Working

### 2. ✅ Meetup Confirmation Email (New)
- **Function**: `sendMeetupConfirmationEmail(data)`
- **Used in**:
  - `/api/invite/[token]/accept/route.ts` - when invitee accepts meetup
- **Purpose**: Confirm meetup details to both organizer and invitee
- **Status**: ✅ Working

### 3. ✅ Meetup Confirmation Email (Old)
- **Function**: `sendMeetupConfirmation(emailData)`
- **Used in**:
  - `/api/meetups/confirm-meetup/route.ts` - legacy confirmation
- **Purpose**: Legacy confirmation email format
- **Status**: ⚠️ Legacy - not used in main workflow

### 4. 👋 Welcome Email
- **Function**: `sendWelcomeEmail(data)`
- **Used in**:
  - `/api/auth/welcome-email/route.ts` - when new user signs up
- **Purpose**: Welcome new users to the platform
- **Status**: ✅ Working

### 5. 📨 Invite Email
- **Function**: `sendInviteEmail(data)`
- **Used in**:
  - `/api/send-invite/route.ts` - when creating new meetup
- **Purpose**: Send meetup invitation to invitee
- **Status**: ✅ Working

### 6. 📅 Calendar Invite Email
- **Function**: `sendCalendarInvite(data)`
- **Used in**:
  - `/api/invite/[token]/confirm/route.ts` - when invitee confirms meetup
- **Purpose**: Send calendar attachment for meetup
- **Status**: ✅ Working

### 7. ⏰ Meetup Reminder Email
- **Function**: `sendMeetupReminder(to, meetupTitle, meetupDate, cafeAddress)`
- **Used in**: Currently not used in any API routes
- **Purpose**: Send reminder before meetup
- **Status**: ⚠️ Not implemented in workflow

### 8. 📧 Welcome Email After Verification
- **Function**: `sendWelcomeEmailAfterVerification(emailData)`
- **Used in**: Currently not used in any API routes
- **Purpose**: Welcome email after email verification
- **Status**: ⚠️ Not implemented in workflow

### 9. 📨 Meetup Invitation Email
- **Function**: `sendMeetupInvitation(emailData)`
- **Used in**: Currently not used in any API routes
- **Purpose**: Send meetup invitation (legacy format)
- **Status**: ⚠️ Not used - replaced by sendInviteEmail

## Email Workflow Summary

### When Creating a Meetup:
1. **Organizer** creates meetup → `sendInviteEmail()` to invitee

### When Accepting a Meetup:
1. **Invitee** accepts meetup → `sendMeetupConfirmationEmail()` to both parties
2. **Invitee** confirms date/time → `sendCalendarInvite()` to invitee

### When Deleting a Meetup:
1. **Organizer** deletes meetup → `sendMeetupCancellation()` to invitee

### When User Signs Up:
1. **New user** signs up → `sendWelcomeEmail()` to new user

## Testing All Emails

Use the debug tool at `/debug-email` to test all email functions:

1. **Cancellation Email**: Test when meetup is deleted
2. **Confirmation Email (New)**: Test when meetup is accepted
3. **Confirmation Email (Old)**: Test legacy confirmation
4. **Welcome Email**: Test for new users
5. **Invite Email**: Test when sending invitation
6. **Calendar Email**: Test calendar attachment
7. **Reminder Email**: Test reminder functionality

## Email Configuration

All emails use **Resend** as the email provider:
- **API Key**: `RESEND_API_KEY` environment variable
- **From Address**: Configured in Resend dashboard
- **Templates**: HTML templates in `src/lib/email.ts`

## Missing Implementation

The following emails are not currently used in any workflow:

1. **Meetup Reminder** email - needs scheduled job
2. **Welcome Email After Verification** - needs verification flow
3. **Meetup Invitation** (legacy) - replaced by sendInviteEmail

To implement these:

1. **Reminder**: Create scheduled job to send reminders
2. **Welcome After Verification**: Add to email verification flow
3. **Legacy Invitation**: Remove if no longer needed

## Email Status Check

To verify all emails work:

1. Go to `/debug-email`
2. Enter your email address
3. Test each email type
4. Check your inbox for received emails
5. Verify email content and formatting

## Common Issues

- **Emails not received**: Check spam folder, verify Resend API key
- **Email formatting**: Check HTML template syntax
- **Missing data**: Ensure all required fields are provided
- **Rate limiting**: Resend has rate limits, check logs for errors

## Summary

**✅ Working Emails (5/9)**:
- Meetup Cancellation
- Meetup Confirmation (New)
- Welcome Email
- Invite Email
- Calendar Invite

**⚠️ Legacy/Unused Emails (4/9)**:
- Meetup Confirmation (Old) - legacy format
- Meetup Reminder - not implemented
- Welcome Email After Verification - not implemented
- Meetup Invitation (legacy) - replaced 