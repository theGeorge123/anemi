# 🔧 Fix Email Verification in Supabase

## 🚨 Problem
User gets "Email not confirmed" error when trying to sign in, even after clicking the verification link.

## 🔍 Root Cause
The Supabase email verification settings are not properly configured, or the verification link is not working correctly.

## ✅ Solution

### Step 1: Check Supabase Email Settings

1. **Go to Supabase Dashboard**
   - Visit [supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project

2. **Go to Authentication > Settings**
   - Click on **Authentication** in the sidebar
   - Click on **Settings** tab

3. **Check Email Settings**
   - **Enable email confirmations**: ✅ Should be enabled
   - **Enable email change confirmations**: ✅ Should be enabled
   - **Enable secure email change**: ✅ Should be enabled

### Step 2: Check Site URL Configuration

1. **Go to Authentication > URL Configuration**
   - **Site URL**: Should be `https://www.anemimeets.com`
   - **Redirect URLs**: Add these URLs:
     ```
     https://www.anemimeets.com/auth/callback
     https://www.anemimeets.com/auth/verify
     https://www.anemimeets.com/confirmed
     ```

### Step 3: Check Email Templates

1. **Go to Authentication > Email Templates**
   - Click on **Confirm signup** template
   - Make sure the template is properly configured
   - The confirmation link should point to your domain

### Step 4: Test the Fix

1. **Create a new test account**
2. **Check the verification email**
3. **Click the verification link**
4. **Try to sign in**

## 🔧 Alternative: Manual Email Confirmation

If the automatic verification is not working, you can manually confirm the email:

### Option 1: Via Supabase Dashboard

1. **Go to Authentication > Users**
2. **Find your user** by email
3. **Click on the user**
4. **Click "Confirm email"**

### Option 2: Via SQL

```sql
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email = 'your-email@example.com';
```

## 🔍 Debug Steps

### 1. Check Email Delivery
- Check spam folder
- Verify email domain is correct
- Test with a different email provider

### 2. Check Verification Link
- Copy the verification link from email
- Check if it points to the correct domain
- Verify the token is valid

### 3. Check Supabase Logs
- Go to Supabase Dashboard > Logs
- Look for authentication events
- Check for any errors

## 🚀 Quick Fix

If you need immediate access:

1. **Go to Supabase Dashboard > Authentication > Users**
2. **Find your user** (maxmeinders2002@gmail.com)
3. **Click on the user**
4. **Click "Confirm email"**
5. **Try signing in again**

## 📧 Email Template Fix

If the verification emails are not working, update the email template:

1. **Go to Authentication > Email Templates**
2. **Edit "Confirm signup" template**
3. **Update the confirmation URL** to:
   ```
   https://www.anemimeets.com/auth/verify?token={{ .Token }}&email={{ .Email }}
   ```

## 🔗 Related Files

- `src/app/api/auth/create-user/route.ts` - Creates user with email confirmation required
- `src/app/auth/verify/page.tsx` - Handles email verification
- `src/app/auth/signin/page.tsx` - Shows specific error for unconfirmed email 