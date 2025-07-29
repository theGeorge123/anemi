# 🔧 Troubleshooting Guide

## Overview
This guide helps you diagnose and fix common issues with environment variables, authentication tokens, and deployment problems.

## Quick Diagnostic Pages

### 1. Environment Variables Check
Visit `/debug-env` to check:
- ✅ All critical environment variables
- 🧹 Stale authentication tokens
- 📋 Specific recommendations for your setup

### 2. Vercel Debug Info
Visit `/debug-vercel` to check:
- 🔌 Supabase connection status
- 🌐 Domain configuration
- 📧 Email verification setup

### 3. Token Cleanup
Visit `/fix-tokens` to:
- 🧹 Clear all stale Supabase tokens
- 🔄 Reset authentication state
- ➡️ Redirect to login page

## Common Issues & Solutions

### 🔐 Authentication Issues

#### Problem: "Invalid login credentials" error
**Symptoms:**
- Login fails even with correct credentials
- Works on localhost but not on production
- Random authentication failures

**Causes:**
- Stale tokens from localhost in browser
- Incorrect Supabase URL/keys
- Domain mismatch in Supabase settings

**Solutions:**
1. **Clear stale tokens:**
   ```bash
   # Visit /fix-tokens page or manually:
   # 1. Open DevTools (F12)
   # 2. Application tab → Local Storage
   # 3. Remove all items starting with "sb-"
   # 4. Application tab → Cookies
   # 5. Remove all cookies starting with "sb-"
   ```

2. **Check Supabase settings:**
   - Go to Supabase Dashboard → Authentication → Settings
   - Verify Site URL matches your domain
   - Check redirect URLs include your production domain

3. **Verify environment variables:**
   ```bash
   # Check these are set in Vercel:
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

### 📧 Email Issues

#### Problem: Email verification not working
**Symptoms:**
- Users can't verify their email
- Reset password emails not received
- Email templates not loading

**Solutions:**
1. **Check email environment variables:**
   ```bash
   EMAIL_FROM=noreply@anemi-meets.com
   RESEND_API_KEY=your-resend-api-key
   NEXT_PUBLIC_SITE_URL=https://www.anemimeets.com
   ```

2. **Verify Supabase email templates:**
   - Go to Supabase Dashboard → Authentication → Email Templates
   - Check Site URL variable is set correctly
   - Test email templates

3. **Check Resend configuration:**
   - Verify domain is verified in Resend
   - Check API key permissions
   - Review email logs in Resend dashboard

### 🌐 Domain Issues

#### Problem: Wrong domain in redirects
**Symptoms:**
- Users redirected to localhost after login
- Email links point to wrong domain
- OAuth providers not working

**Solutions:**
1. **Set correct site URL:**
   ```bash
   NEXT_PUBLIC_SITE_URL=https://www.anemimeets.com
   ```

2. **Update Supabase redirect URLs:**
   - Go to Supabase Dashboard → Authentication → Settings
   - Add your production domain to redirect URLs
   - Remove localhost URLs if not needed

3. **Check Vercel domain settings:**
   - Verify custom domain is configured
   - Check SSL certificate is valid
   - Ensure DNS records are correct

### 🗄️ Database Issues

#### Problem: Database connection errors
**Symptoms:**
- API routes returning 500 errors
- "Database connection failed" messages
- RLS policies not working

**Solutions:**
1. **Check DATABASE_URL:**
   ```bash
   DATABASE_URL=postgresql://username:password@host:port/database
   ```

2. **Verify RLS policies:**
   - Check if RLS is enabled on tables
   - Verify policies are correctly configured
   - Test with service role key

3. **Check Supabase connection:**
   - Verify Supabase project is online
   - Check API rate limits
   - Review connection pool settings

## Environment Variables Checklist

### Critical Variables (Required)
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://www.anemimeets.com

# Database
DATABASE_URL=postgresql://username:password@host:port/database
```

### Optional Variables
```bash
# Email Configuration
EMAIL_FROM=noreply@anemi-meets.com
RESEND_API_KEY=your-resend-api-key

# Features
GOOGLE_MAPS_API_KEY=your-google-maps-key
DISABLE_EMAILS=false
```

## Debug Commands

### Check Environment Variables
```bash
# Visit /debug-env to see all variables
# Or check in Vercel dashboard:
# Settings → Environment Variables
```

### Test Supabase Connection
```bash
# Visit /debug-vercel to test connection
# Or use browser console:
fetch('/api/debug-vercel').then(r => r.json()).then(console.log)
```

### Clear Tokens Programmatically
```bash
# In browser console:
localStorage.clear()
sessionStorage.clear()
document.cookie.split(";").forEach(c => {
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
})
```

## Vercel Deployment Issues

### Environment Variables Not Set
1. Go to Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Add missing variables
4. Redeploy project

### Build Failures
1. Check build logs in Vercel dashboard
2. Verify all required environment variables are set
3. Check for TypeScript errors
4. Ensure all dependencies are in package.json

### Runtime Errors
1. Check function logs in Vercel dashboard
2. Verify API routes are working
3. Test database connections
4. Check authentication flow

## Supabase Configuration

### Authentication Settings
1. **Site URL:** Set to your production domain
2. **Redirect URLs:** Include your production domain
3. **Email Templates:** Use correct Site URL variable
4. **OAuth Providers:** Configure if using social login

### Database Settings
1. **RLS Policies:** Ensure they're enabled and configured
2. **API Keys:** Verify anon and service role keys
3. **Connection Pool:** Check for connection limits
4. **Backups:** Verify backup schedule

### Email Settings
1. **SMTP Configuration:** If using custom SMTP
2. **Email Templates:** Customize for your brand
3. **Sender Verification:** Verify sender domains
4. **Rate Limits:** Check email sending limits

## Testing Checklist

### Before Deployment
- [ ] All environment variables set in Vercel
- [ ] Supabase project is online
- [ ] Database migrations applied
- [ ] Email templates configured
- [ ] Custom domain configured

### After Deployment
- [ ] Visit `/debug-env` - no critical issues
- [ ] Visit `/debug-vercel` - connection successful
- [ ] Test user registration
- [ ] Test email verification
- [ ] Test password reset
- [ ] Test login/logout flow

### Production Monitoring
- [ ] Check Vercel function logs regularly
- [ ] Monitor Supabase usage and limits
- [ ] Review email delivery rates
- [ ] Test authentication flow weekly

## Emergency Procedures

### If Authentication is Broken
1. Clear all browser tokens (`/fix-tokens`)
2. Check environment variables (`/debug-env`)
3. Verify Supabase connection (`/debug-vercel`)
4. Check Supabase project status
5. Redeploy if necessary

### If Emails Not Working
1. Check Resend API key and domain verification
2. Verify email templates in Supabase
3. Check environment variables
4. Review email logs in Resend dashboard

### If Database Issues
1. Check Supabase project status
2. Verify DATABASE_URL is correct
3. Check RLS policies
4. Review connection pool settings

## Support Resources

- **Vercel Documentation:** https://vercel.com/docs
- **Supabase Documentation:** https://supabase.com/docs
- **Resend Documentation:** https://resend.com/docs
- **Project Issues:** Check GitHub issues
- **Debug Pages:** Use built-in debug tools

## Quick Commands

```bash
# Check environment variables
curl https://your-domain.vercel.app/api/debug-env

# Test Supabase connection
curl https://your-domain.vercel.app/api/debug-vercel

# Clear tokens (browser only)
window.location.href = '/fix-tokens'
``` 