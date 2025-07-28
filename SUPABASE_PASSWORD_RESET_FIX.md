# 🔧 Fix Password Reset Email Template in Supabase

## 🚨 Problem
The "Wachtwoord vergeten?" link shows a form but sends a verification email instead of a password reset email.

## ✅ Solution

### Step 1: Configure Supabase Email Template

1. **Go to Supabase Dashboard**
   - Visit [supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project

2. **Go to Authentication > Email Templates**
   - Click on **Authentication** in the sidebar
   - Click on **Email Templates** tab

3. **Configure "Reset Password" Template**
   - Click on **Reset Password** template
   - Update the template with this content:

```html
<h2>Reset Your Password</h2>
<p>Hello,</p>
<p>You have requested to reset your password for your Anemi Meets account.</p>
<p>Click the link below to reset your password:</p>
<p><a href="{{ .ConfirmationURL }}">Reset Password</a></p>
<p>If you didn't request this password reset, you can safely ignore this email.</p>
<p>This link will expire in 24 hours.</p>
<p>Best regards,<br>Anemi Meets Team</p>
```

4. **Update Email Subject**
   - Set the subject to: `Reset Your Password - Anemi Meets`

### Step 2: Check Site URL Configuration

1. **Go to Authentication > URL Configuration**
   - **Site URL**: Should be `https://www.anemimeets.com`
   - **Redirect URLs**: Make sure these URLs are added:
     ```
     https://www.anemimeets.com/auth/callback
     https://www.anemimeets.com/auth/reset-password
     https://www.anemimeets.com/confirmed
     ```

### Step 3: Verify Email Settings

1. **Go to Authentication > Settings**
   - **Enable email confirmations**: ✅ Should be enabled
   - **Enable email change confirmations**: ✅ Should be enabled
   - **Enable secure email change**: ✅ Should be enabled

### Step 4: Test the Fix

1. **Test the password reset flow**:
   - Go to `/auth/forgot-password`
   - Enter a valid email address
   - Submit the form
   - Check your email for the reset link
   - Click the link to test the reset page

2. **Expected behavior**:
   - Email should have subject "Reset Your Password - Anemi Meets"
   - Email should contain a reset link
   - Clicking the link should take you to `/auth/reset-password`
   - You should be able to set a new password

## 🔍 Debug Steps

### Check Email Template Configuration

If the email template is not working correctly:

1. **Verify template variables**:
   - `{{ .ConfirmationURL }}` should be used for the reset link
   - `{{ .Email }}` can be used to show the user's email
   - `{{ .SiteURL }}` can be used for your site URL

2. **Test with different email providers**:
   - Gmail
   - Outlook
   - Yahoo
   - Check spam folders

### Check API Implementation

The API route `/api/auth/send-password-reset` now uses:
```typescript
const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/reset-password`
})
```

This should send the correct password reset email template.

### Check Reset Page

The reset page `/auth/reset-password` now:
- Checks for a valid session (set by the reset link)
- Shows an error if the link is invalid
- Allows setting a new password if the link is valid

## 🚨 Common Issues

### Issue 1: Still getting verification email
**Solution**: Make sure you're using `resetPasswordForEmail` instead of `generateLink` with type 'recovery'

### Issue 2: Reset link doesn't work
**Solution**: 
- Check that the redirect URL is correct in Supabase settings
- Verify the email template uses `{{ .ConfirmationURL }}`
- Make sure the reset page checks for a valid session

### Issue 3: User not found error
**Solution**: 
- The API now properly handles this case
- Shows a user-friendly error message
- Returns 404 status code

## 📧 Email Template Best Practices

1. **Clear subject line**: "Reset Your Password - Anemi Meets"
2. **Clear call to action**: "Reset Password" button
3. **Security notice**: Mention that the link expires
4. **Branding**: Include your app name
5. **Fallback**: Mention what to do if they didn't request it

## 🔄 Testing Checklist

- [ ] Password reset form works
- [ ] Email is sent with correct subject
- [ ] Email contains reset link
- [ ] Reset link redirects to correct page
- [ ] Reset page shows form for valid links
- [ ] Reset page shows error for invalid links
- [ ] New password can be set
- [ ] User can login with new password
- [ ] Error handling works for non-existent users

## 🎯 Expected Flow

1. User clicks "Wachtwoord vergeten?"
2. User enters email and submits
3. API calls `resetPasswordForEmail`
4. Supabase sends password reset email
5. User clicks link in email
6. User lands on `/auth/reset-password`
7. User sets new password
8. User is redirected to login page
9. User can login with new password

This should now work correctly with the proper password reset email template! 