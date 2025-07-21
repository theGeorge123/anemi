# 🚀 Vercel Deployment Checklist

## **❌ Current Issue: Supabase Auth Error**
```
AuthApiError: Invalid login credentials
Failed to load resource: the server responded with a status of 400 () (token, line 0)
```

## **🔧 Required Environment Variables**

### **Essential Variables (Must be set in Vercel Dashboard):**

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Email (Resend)
RESEND_API_KEY=your-resend-api-key
EMAIL_FROM=noreply@anemi-meets.com

# Site URL (for invite links)
NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app
```

## **📋 Step-by-Step Fix:**

### **1. Check Supabase Configuration**
- [ ] Go to your Supabase project dashboard
- [ ] Copy the project URL from Settings > API
- [ ] Copy the anon/public key from Settings > API
- [ ] Copy the service_role key from Settings > API

### **2. Set Environment Variables in Vercel**
- [ ] Go to your Vercel project dashboard
- [ ] Navigate to Settings > Environment Variables
- [ ] Add each variable from the list above
- [ ] Make sure to set the correct environment (Production, Preview, Development)

### **3. Update Supabase Settings**
- [ ] Go to Supabase Dashboard > Settings > API
- [ ] Add your Vercel domain to "Additional Redirect URLs":
  ```
  https://your-domain.vercel.app/auth/callback
  https://your-domain.vercel.app/confirmed
  ```
- [ ] Add your Vercel domain to "Site URL":
  ```
  https://your-domain.vercel.app
  ```

### **4. Redeploy**
- [ ] After setting environment variables, trigger a new deployment
- [ ] Check the deployment logs for any errors
- [ ] Test the application on the new deployment

## **🔍 Debug Steps:**

### **1. Check Environment Variables**
Visit: `https://your-domain.vercel.app/debug-env`
This will show you which environment variables are set and test the Supabase connection.

### **2. Check Vercel Function Logs**
- Go to Vercel Dashboard > Functions
- Check for any errors in the function logs
- Look for Supabase connection errors

### **3. Test Supabase Connection**
The debug page will show:
- ✅ Environment variables status
- ✅ Supabase connection test
- ❌ Any configuration errors

## **🚨 Common Issues:**

### **Issue 1: "Invalid login credentials"**
**Cause:** Supabase environment variables not set correctly
**Solution:** 
- Double-check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Ensure they match your Supabase project settings

### **Issue 2: "Failed to load resource: 400"**
**Cause:** Supabase project not configured for your domain
**Solution:**
- Add your Vercel domain to Supabase redirect URLs
- Check if your Supabase project is active

### **Issue 3: Environment variables not loading**
**Cause:** Variables not set in Vercel or wrong environment
**Solution:**
- Ensure variables are set for "Production" environment
- Redeploy after adding variables

## **✅ Success Indicators:**

After fixing the configuration, you should see:
- ✅ No "Invalid login credentials" errors
- ✅ Successful Supabase connection test on `/debug-env`
- ✅ Authentication working properly
- ✅ Meetup creation and invite system working

## **📞 Support:**

If issues persist:
1. Check the debug page: `/debug-env`
2. Review Vercel function logs
3. Verify Supabase project settings
4. Test with a fresh deployment

---

**Last Updated:** $(date)
**Status:** 🔴 Needs Environment Variables Configuration 