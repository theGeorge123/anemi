# 🚀 Vercel Environment Variables Fix

## **❌ Current Issue:**
```
✅ Works locally
❌ Fails on Vercel with "No API key found in request"
```

## **🔍 Root Cause:**
Environment variables are not properly set in Vercel or there's a caching issue.

## **📋 Step-by-Step Fix:**

### **1. Check Vercel Environment Variables**

**Go to Vercel Dashboard:**
1. Navigate to your project
2. Go to **Settings > Environment Variables**
3. Check if these variables are set for **Production**:

```bash
# REQUIRED - Must be set for Production
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
DATABASE_URL=postgresql://username:password@host:port/database
RESEND_API_KEY=your-resend-api-key
EMAIL_FROM=noreply@anemi-meets.com
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

### **2. Verify Environment Variable Values**

**Important:** Make sure the values match your local `.env.local`:

```bash
# Check your local .env.local file
cat .env.local

# Compare with Vercel dashboard values
```

### **3. Force Redeploy**

**After setting environment variables:**
1. Go to **Deployments** tab
2. Click **"Redeploy"** on the latest deployment
3. Or push a new commit to trigger deployment

### **4. Clear Vercel Cache**

**If variables are set but still not working:**
1. Go to **Settings > General**
2. Scroll down to **"Build & Development Settings"**
3. Click **"Clear Build Cache"**
4. Redeploy

## **🔍 Debug Steps:**

### **1. Check Environment Variables on Vercel:**
Visit: `https://your-domain.vercel.app/debug-env`
- Shows all environment variables
- Indicates if running on Vercel
- Tests Supabase connection

### **2. Check Vercel Function Logs:**
1. Go to Vercel Dashboard > Functions
2. Look for any errors in the logs
3. Check if environment variables are being loaded

### **3. Test with Browser Console:**
```javascript
// In browser console on your Vercel site
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('Supabase Key length:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length)
console.log('Is Vercel:', !!process.env.VERCEL_URL)
```

## **🚨 Common Issues:**

### **Issue 1: Environment Variables Not Set**
**Symptoms:** Variables show as "❌ Missing" on debug page
**Solution:** Add them in Vercel dashboard

### **Issue 2: Wrong Environment**
**Symptoms:** Variables set but for wrong environment (Preview vs Production)
**Solution:** Ensure variables are set for "Production"

### **Issue 3: Caching Issue**
**Symptoms:** Variables set but old deployment still running
**Solution:** Clear cache and redeploy

### **Issue 4: Wrong Values**
**Symptoms:** Variables set but with wrong values
**Solution:** Double-check values match your local `.env.local`

## **✅ Success Indicators:**

After fixing:
- ✅ Debug page shows all variables as "✅ Set"
- ✅ Supabase connection test passes
- ✅ No "No API key found" errors
- ✅ Authentication works
- ✅ Meetup creation works

## **📞 If Still Not Working:**

1. **Check Vercel logs** for any errors
2. **Verify Supabase project** is active and not paused
3. **Test with a fresh deployment** by pushing a new commit
4. **Contact Vercel support** if environment variables are set but not loading

---

**Last Updated:** $(date)
**Status:** 🔴 Needs Vercel Environment Variables Configuration 