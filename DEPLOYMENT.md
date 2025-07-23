# 🚀 Anemi Meets Deployment Guide

## **Critical Environment Variables for Production**

### **🚨 CRITICAL: NEXT_PUBLIC_SITE_URL**
This is the most important environment variable for production deployment. Without it, email verification and invite links will default to localhost.

**Set this in Vercel:**
```
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

**Examples:**
- `https://anemi-meets.vercel.app`
- `https://www.anemimeets.com`
- `https://your-custom-domain.com`

## **Required Environment Variables**

### **Supabase Configuration**
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### **Email Configuration (Resend)**
```
RESEND_API_KEY=your-resend-api-key
EMAIL_FROM=noreply@anemi-meets.com
```

### **Database**
```
DATABASE_URL=your-production-database-url
```

## **Optional Environment Variables**

### **Maps & Location**
```
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### **Monitoring**
```
SENTRY_DSN=your-sentry-dsn
GOOGLE_ANALYTICS_ID=your-ga-id
```

## **Vercel Deployment Steps**

1. **Connect Repository**
   - Connect your GitHub repository to Vercel
   - Set up automatic deployments

2. **Configure Environment Variables**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add all required variables above
   - **CRITICAL:** Set `NEXT_PUBLIC_SITE_URL` to your Vercel domain

3. **Deploy**
   - Push to main branch triggers automatic deployment
   - Or manually deploy from Vercel dashboard

## **Post-Deployment Verification**

### **✅ Critical Checks:**
- [ ] Email verification links work (not localhost)
- [ ] Invite links work (not localhost)
- [ ] Supabase connection works
- [ ] Database queries work
- [ ] All API endpoints respond

### **✅ Functionality Tests:**
- [ ] User registration and login
- [ ] Meetup creation flow
- [ ] Cafe selection (random + map/list)
- [ ] Invite generation and acceptance
- [ ] Email notifications

### **✅ Technical Tests:**
- [ ] No console errors
- [ ] Responsive design works
- [ ] Loading states work
- [ ] Error handling works

## **Troubleshooting**

### **Email Links Go to Localhost**
**Problem:** Email verification and invite links redirect to localhost
**Solution:** Set `NEXT_PUBLIC_SITE_URL` in Vercel environment variables

### **Supabase Connection Issues**
**Problem:** "Not authorized" errors
**Solution:** Check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### **Email Not Sending**
**Problem:** Users don't receive verification emails
**Solution:** Check `RESEND_API_KEY` and `EMAIL_FROM`

### **Map Not Loading**
**Problem:** Cafes not showing on map
**Solution:** Check `GOOGLE_MAPS_API_KEY` and database cafe data

## **Security Checklist**

- [ ] All sensitive keys are in environment variables
- [ ] No hardcoded credentials in code
- [ ] RLS policies are active in Supabase
- [ ] Rate limiting is configured
- [ ] HTTPS is enforced

## **Performance Optimization**

- [ ] Images are optimized
- [ ] Code splitting is working
- [ ] API responses are cached
- [ ] Database queries are optimized
- [ ] Bundle size is reasonable

## **Monitoring Setup**

1. **Error Tracking**
   - Set up Sentry for error monitoring
   - Configure error boundaries

2. **Analytics**
   - Set up Google Analytics
   - Track user interactions

3. **Uptime Monitoring**
   - Set up uptime monitoring
   - Configure alerts

## **Backup & Recovery**

1. **Database Backups**
   - Set up automated Supabase backups
   - Test restore procedures

2. **Code Backups**
   - Repository is backed up on GitHub
   - Multiple deployment environments

## **Support & Maintenance**

### **Regular Maintenance:**
- Update dependencies monthly
- Monitor error rates
- Check performance metrics
- Review security updates

### **Emergency Procedures:**
- Rollback to previous deployment
- Disable problematic features
- Contact support if needed

---

**Remember: The most critical step is setting `NEXT_PUBLIC_SITE_URL` correctly!** 🚨 