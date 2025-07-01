# Vercel Deployment Guide

Complete guide to deploying Anemi Meets on Vercel.

## 🚀 Prerequisites

- [Vercel account](https://vercel.com/signup)
- [GitHub repository](https://github.com/theGeorge123/anemi) connected to Vercel
- Supabase project set up
- Environment variables configured

## 📋 Pre-Deployment Checklist

### ✅ Code Quality
- [ ] All tests pass (`npm run test`)
- [ ] TypeScript compilation successful (`npm run type-check`)
- [ ] ESLint passes (`npm run lint`)
- [ ] Build successful locally (`npm run build`)

### ✅ Environment Variables
- [ ] All required environment variables documented
- [ ] Production values ready
- [ ] Sensitive data not committed to repository

### ✅ Database
- [ ] Supabase project created
- [ ] Database migrations applied
- [ ] Row Level Security (RLS) policies configured
- [ ] Seed data loaded (if needed)

## 🔧 Deployment Steps

### 1. Connect Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Import your GitHub repository: `theGeorge123/anemi`
4. Select the repository and click **"Deploy"**

### 2. Configure Project Settings

#### Framework Preset
- **Framework Preset**: Next.js
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install`

#### Environment Variables
Add these environment variables in Vercel:

```env
# Database
DATABASE_URL="postgresql://postgres:[password]@[host]:5432/postgres"

# Authentication
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-32-character-secret"

# Email Service
RESEND_API_KEY="re_xxxxxxxxxxxx"

# Maps
GOOGLE_MAPS_API_KEY="AIzaSyCxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# Optional: Analytics
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

### 3. Configure Build Settings

#### Build Command
```bash
npm run build
```

#### Install Command
```bash
npm install
```

#### Output Directory
```
.next
```

### 4. Database Setup

#### Run Migrations
```bash
# In Vercel dashboard, go to Functions > Shell
npx prisma migrate deploy
```

#### Generate Prisma Client
```bash
npx prisma generate
```

### 5. Deploy

1. Click **"Deploy"** in Vercel dashboard
2. Monitor the build process
3. Check for any build errors
4. Verify deployment success

## 🔍 Post-Deployment Verification

### 1. Health Check
Visit your deployment URL and check:
- [ ] Homepage loads correctly
- [ ] API health endpoint: `https://your-domain.vercel.app/api/health`
- [ ] No console errors in browser

### 2. Functionality Test
- [ ] Create a meetup invitation
- [ ] Send email invitations
- [ ] Confirm invitations
- [ ] Coffee shop discovery
- [ ] Mobile responsiveness

### 3. Performance Check
- [ ] Page load times < 3 seconds
- [ ] Core Web Vitals in acceptable range
- [ ] No 404 or 500 errors

## 🔧 Configuration Options

### Custom Domain
1. Go to **Settings > Domains**
2. Add your custom domain
3. Configure DNS records as instructed
4. Enable HTTPS (automatic with Vercel)

### Environment Variables by Environment
```bash
# Production
DATABASE_URL="postgresql://prod-user:prod-pass@prod-host:5432/prod-db"

# Preview (staging)
DATABASE_URL="postgresql://staging-user:staging-pass@staging-host:5432/staging-db"
```

### Build Optimization
```json
// next.config.js
module.exports = {
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@radix-ui/react-icons'],
  },
  images: {
    domains: ['your-image-domain.com'],
  },
}
```

## 🔄 Continuous Deployment

### Automatic Deployments
- **Main branch**: Deploys to production
- **Feature branches**: Deploys to preview URLs
- **Pull requests**: Creates preview deployments

### Deployment Triggers
```bash
# Manual deployment
vercel --prod

# Deploy specific branch
vercel --prod --branch=main
```

## 📊 Monitoring & Analytics

### Vercel Analytics
1. Enable Vercel Analytics in project settings
2. Add analytics script to your app
3. Monitor performance metrics

### Error Monitoring
```typescript
// Add error monitoring (e.g., Sentry)
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

## 🔒 Security Configuration

### Environment Variables Security
- [ ] All secrets stored in Vercel environment variables
- [ ] No sensitive data in code or logs
- [ ] API keys have proper restrictions

### Headers Configuration
```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};
```

## 🚨 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Check build logs in Vercel dashboard
# Common causes:
# - Missing environment variables
# - TypeScript errors
# - Missing dependencies
```

#### Database Connection Issues
```bash
# Verify DATABASE_URL format
# Check Supabase project status
# Ensure RLS policies are configured
```

#### Environment Variable Issues
```bash
# Verify all required variables are set
# Check variable names (case-sensitive)
# Ensure no trailing spaces
```

### Debug Commands
```bash
# Check build locally
npm run build

# Test production build
npm run start

# Check environment variables
echo $DATABASE_URL
```

## 📈 Performance Optimization

### Build Optimization
- [ ] Enable Vercel's build cache
- [ ] Optimize bundle size
- [ ] Use dynamic imports for large components
- [ ] Implement proper caching strategies

### Runtime Optimization
- [ ] Enable edge functions where appropriate
- [ ] Optimize database queries
- [ ] Implement proper error boundaries
- [ ] Use React.memo for expensive components

## 🔄 Updates & Maintenance

### Regular Updates
1. **Dependencies**: Update npm packages regularly
2. **Security**: Monitor for security vulnerabilities
3. **Performance**: Monitor Core Web Vitals
4. **Backups**: Ensure database backups are configured

### Deployment Strategy
```bash
# Staging deployment
git push origin staging
# Deploys to preview URL

# Production deployment
git push origin main
# Deploys to production
```

## 📞 Support

### Vercel Support
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [Vercel Support](https://vercel.com/support)

### Project-Specific Issues
- Create an issue on GitHub
- Check the [Troubleshooting Guide](../operations/troubleshooting.md)
- Review deployment logs in Vercel dashboard

---

*Your Anemi Meets application is now live on Vercel! 🚀* 