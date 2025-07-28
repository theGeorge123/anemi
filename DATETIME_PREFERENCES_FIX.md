# Date/Time Preferences & Email Fixes

## Issues Fixed

### 1. Date/Time Selection Problem (Dutch: "tijden per datum kiezen")

**Problem**: When person A (organizer) created a meetup with specific times for specific dates, person B (invitee) couldn't see the correct time options per date. The system was showing all available times for all dates instead of the specific times chosen for each date.

**Root Cause**: The database schema and API endpoints were not properly storing or retrieving the date-time preferences mapping.

**Solution Implemented**:

#### Database Schema Update
- Added `dateTimePreferences` field to `MeetupInvite` model as JSON type
- Stores mapping like: `{"2024-01-15": ["10:00", "14:00"], "2024-01-16": ["11:00"]}`

#### API Updates
1. **Generate Invite API** (`/api/generate-invite`)
   - Now stores `dateTimePreferences` from the meetup creation form
   
2. **Invite Retrieval API** (`/api/invite/[token]`)
   - Now returns `dateTimePreferences` in the response

#### Frontend Updates
1. **Invite Page** (`/invite/[token]/page.tsx`)
   - Updated interface to include `dateTimePreferences`
   - Modified time selection logic to show only available times for selected date
   - Added logic to reset selected time when date changes
   - Added helpful message when no date is selected

2. **Time Selection Logic**
   - If `dateTimePreferences` exists for selected date → show only those times
   - Otherwise → fallback to all available times
   - Clear selected time when switching dates

### 2. Email Invitation Problem

**Problem**: Email invitations were not working properly.

**Root Cause**: Poor error handling and validation in email service.

**Solution Implemented**:

#### Email Service Improvements
1. **Better Error Handling** (`src/lib/email.ts`)
   - Added validation for `RESEND_API_KEY` environment variable
   - Improved email address validation
   - Enhanced error logging with detailed debugging info

2. **Send Invite API** (`/api/send-invite`)
   - Added debug information in error responses
   - Better environment variable checking
   - More descriptive error messages

#### Environment Variable Requirements
- `RESEND_API_KEY`: Required for email functionality
- `EMAIL_FROM`: Sender email address (optional, defaults to noreply@anemi-meets.com)
- `NEXT_PUBLIC_SITE_URL`: Required for invitation links

## Files Modified

### Database
- `prisma/schema.prisma`: Added `dateTimePreferences Json?` field

### API Routes
- `src/app/api/generate-invite/route.ts`: Store dateTimePreferences
- `src/app/api/invite/[token]/route.ts`: Return dateTimePreferences
- `src/app/api/send-invite/route.ts`: Improved error handling

### Frontend Components
- `src/app/invite/[token]/page.tsx`: Updated time selection logic
- `src/lib/email.ts`: Enhanced email service with better validation

## Testing Recommendations

### Test Date/Time Preferences
1. Create a meetup with specific times for specific dates
2. Use the DateTimePreferences component to set different times for different dates
3. Generate an invite and test accepting it
4. Verify that only correct times show for each selected date

### Test Email Functionality
1. Ensure `RESEND_API_KEY` is set in environment variables
2. Create a meetup and send an invitation
3. Check logs for detailed error messages if email fails
4. Verify email delivery

## Deployment Notes

### Environment Variables Required
```bash
RESEND_API_KEY="your-resend-api-key"
EMAIL_FROM="noreply@yourdomain.com"  # Optional
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
```

### Database Migration
If using a database, run:
```bash
npx prisma migrate dev --name add-datetime-preferences
```

Or for production:
```bash
npx prisma migrate deploy
```

## User Experience Improvements

### For Organizers (Person A)
- Can now set specific times for specific dates using DateTimePreferences component
- Times are properly stored and transmitted to invitees

### For Invitees (Person B)
- See only relevant times for each selected date
- Clear indication when no date is selected
- Better user flow with time selection reset on date change

### Email Functionality
- Clear error messages when email service is misconfigured
- Better debugging information for administrators
- Improved reliability with proper validation

## Future Enhancements

1. **UI/UX**
   - Add visual indicators showing which dates have specific times vs. all times
   - Improve mobile responsive design for time selection

2. **Email**
   - Add email templates with better styling
   - Support for multiple email providers (not just Resend)
   - Email preview functionality

3. **Validation**
   - Add client-side validation for date/time combinations
   - Prevent selection of past dates/times
   - Add timezone support