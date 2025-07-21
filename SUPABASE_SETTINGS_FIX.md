# 🔧 Supabase Settings Fix Guide

## **❌ Current Issue:**
```
✅ Supabase client created successfully
❌ AuthApiError: Invalid login credentials
```

## **🔍 Root Cause:**
The Supabase client is created successfully, but the auth API call fails. This indicates a **Supabase project configuration issue**, not a code problem.

## **📋 Step-by-Step Fix:**

### **1. Supabase Dashboard > Settings > API**

**Check these settings:**

#### **Project URL:**
```
https://your-project-ref.supabase.co
```
- Should match your `NEXT_PUBLIC_SUPABASE_URL`

#### **Site URL:**
```
https://your-vercel-domain.vercel.app
```
- Add your Vercel domain here

#### **Additional Redirect URLs:**
```
https://your-vercel-domain.vercel.app/auth/callback
https://your-vercel-domain.vercel.app/confirmed
https://your-vercel-domain.vercel.app/auth/signin
https://your-vercel-domain.vercel.app/auth/signup
```

### **2. Supabase Dashboard > Authentication > Settings**

#### **Enable Email Auth:**
- ✅ Enable email confirmations
- ✅ Enable email change confirmations
- ✅ Enable secure email change

#### **URL Configuration:**
- **Site URL**: `https://your-vercel-domain.vercel.app`
- **Redirect URLs**: Add all the URLs from step 1

### **3. Check API Keys**

#### **In Supabase Dashboard > Settings > API:**
- **Project API keys** should match your environment variables
- **anon public** key should match `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role** key should match `SUPABASE_SERVICE_ROLE_KEY`

### **4. Test the Fix**

After updating settings:
1. Wait 1-2 minutes for changes to propagate
2. Visit: `https://your-domain.vercel.app/debug-env`
3. Click "Test Connection"
4. Should see: ✅ Connected

## **🚨 Common Issues:**

### **Issue 1: Wrong Site URL**
**Symptoms:** Auth works locally but fails on Vercel
**Solution:** Set Site URL to your Vercel domain

### **Issue 2: Missing Redirect URLs**
**Symptoms:** Auth redirects fail
**Solution:** Add all auth callback URLs

### **Issue 3: CORS Issues**
**Symptoms:** 400 errors from Supabase
**Solution:** Check if your domain is allowed in Supabase settings

## **🔍 Debug Steps:**

### **1. Check Current Settings:**
Visit: `https://your-domain.vercel.app/debug-env`
- Shows environment variables status
- Tests Supabase connection
- Shows detailed error information

### **2. Check Supabase Logs:**
- Go to Supabase Dashboard > Logs
- Look for auth errors
- Check for CORS or domain issues

### **3. Test with Browser Console:**
```javascript
// In browser console on your Vercel site
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('Supabase Key length:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length)
```

## **✅ Success Indicators:**

After fixing the settings:
- ✅ No "Invalid login credentials" errors
- ✅ Successful connection test on `/debug-env`
- ✅ Authentication working properly
- ✅ Sign up/sign in working
- ✅ Meetup creation working

## **📞 If Still Not Working:**

1. **Double-check domain spelling** in Supabase settings
2. **Wait 2-3 minutes** after changing settings
3. **Clear browser cache** and try again
4. **Check Supabase project status** (not paused/suspended)
5. **Verify API keys** are from the correct project

---

**Last Updated:** $(date)
**Status:** 🔴 Needs Supabase Project Settings Update 