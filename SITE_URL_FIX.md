# 🔧 Fix Missing Site URL Environment Variable

## 🚨 Problem
The `NEXT_PUBLIC_SITE_URL` environment variable is not set on Vercel, which causes:
- Invite links to redirect to localhost instead of your domain
- Email links to point to the wrong URL
- Dashboard errors when loading meetups

## ✅ Solution

### Step 1: Add Environment Variable to Vercel

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your `anemi` project

2. **Navigate to Settings**
   - Click on your project
   - Go to **Settings** tab
   - Click on **Environment Variables**

3. **Add the Variable**
   - Click **Add New**
   - **Name**: `NEXT_PUBLIC_SITE_URL`
   - **Value**: `https://www.anemimeets.com`
   - **Environment**: Select **Production** (and optionally Preview/Development)
   - Click **Save**

### Step 2: Redeploy Your Application

1. **Trigger a new deployment**
   - Go to **Deployments** tab
   - Click **Redeploy** on your latest deployment
   - Or push a new commit to trigger automatic deployment

### Step 3: Verify the Fix

1. **Check the debug page**
   - Visit `https://www.anemimeets.com/debug-vercel`
   - Look for "Site URL Env: ✅ Set" instead of "❌ Missing"

2. **Test invite functionality**
   - Create a new meetup
   - Send an invite
   - Check that the invite link points to `https://www.anemimeets.com/invite/[token]`

## 🔍 Why This Happens

- **Custom Domain**: You're using `www.anemimeets.com` but Vercel defaults to `anemi-8yaulxon1-maxmeinders2002-gmailcoms-projects.vercel.app`
- **Environment Variables**: The app needs to know which domain to use for generating links
- **Invite Links**: Without this variable, links default to `localhost:3000` or the Vercel URL

## 📋 Environment Variables Checklist

Make sure you have these set in Vercel:

- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`
- ✅ `DATABASE_URL`
- ✅ `RESEND_API_KEY`
- ✅ `EMAIL_FROM`
- ✅ `GOOGLE_MAPS_API_KEY`
- ❌ `NEXT_PUBLIC_SITE_URL` ← **This is missing!**

## 🚀 After Fixing

Once you add the environment variable and redeploy:

1. **Invite links** will work correctly
2. **Email notifications** will point to the right domain
3. **Dashboard** should load meetups without errors
4. **Authentication** should work properly

## 🔗 Related Files

- `src/app/api/send-invite/route.ts` - Uses `NEXT_PUBLIC_SITE_URL` for invite links
- `src/app/api/generate-invite/route.ts` - Uses `NEXT_PUBLIC_SITE_URL` for invite URLs
- `src/app/layout.tsx` - Uses `NEXT_PUBLIC_SITE_URL` for metadata base URL
- `src/app/dashboard/page.tsx` - Uses `NEXT_PUBLIC_SITE_URL` for invite links

## 📞 Need Help?

If you're still having issues after adding the environment variable:

1. Check the debug page: `/debug-vercel`
2. Clear browser cache and cookies
3. Try the token fix page: `/fix-tokens`
4. Check Supabase settings: `/debug-auth` 