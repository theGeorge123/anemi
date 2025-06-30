# 🚀 Supabase Deployment Guide for Anemi Meets

## Quick Start

### Option 1: Automated Setup (Recommended)
```bash
# Run the automated setup script
./setup-supabase.sh
```

### Option 2: Manual Setup
Follow the step-by-step instructions below.

## 📋 Prerequisites

1. **Node.js 18+** - [Download here](https://nodejs.org/)
2. **Supabase Account** - [Sign up here](https://supabase.com)
3. **Resend Account** - [Sign up here](https://resend.com)
4. **Git** - For version control

## 🔧 Step-by-Step Setup

### 1. Install Dependencies

```bash
# Install project dependencies
npm install

# Install Supabase CLI globally
npm install -g supabase
```

### 2. Create Supabase Project

1. **Go to [supabase.com](https://supabase.com)** and sign in
2. **Click "New Project"**
3. **Choose your organization**
4. **Enter project details:**
   - Name: `anemi-meets`
   - Database Password: (choose a strong password)
   - Region: (choose closest to your users)
5. **Click "Create new project"**
6. **Wait for setup to complete** (2-3 minutes)

### 3. Get Project Credentials

1. **Go to Settings > API** in your Supabase dashboard
2. **Copy the following values:**
   - Project URL
   - Anon public key
   - Service role key (keep this secret!)

### 4. Configure Environment Variables

```bash
# Copy the environment template
cp env.example .env.local

# Edit .env.local with your credentials
nano .env.local
```

Update `.env.local` with your Supabase credentials:

```env
# Database
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# Email (Resend)
RESEND_API_KEY="your-resend-api-key"
EMAIL_FROM="noreply@anemi-meets.com"

# Maps & Location Services
GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
MAPBOX_ACCESS_TOKEN="your-mapbox-access-token"
```

### 5. Set Up Resend Email

1. **Go to [resend.com](https://resend.com)** and sign up
2. **Get your API key** from the dashboard
3. **Add your domain** for sending emails
4. **Update your `.env.local`** with the API key

### 6. Initialize Supabase Project

```bash
# Initialize Supabase in your project
supabase init

# Login to Supabase CLI
supabase login

# Link to your project
supabase link --project-ref [YOUR-PROJECT-REF]
```

### 7. Deploy Database Schema

```bash
# Generate Prisma client
npm run db:generate

# Push schema to Supabase
npx prisma db push

# Apply RLS policies
supabase db push

# Run RLS migration
psql "$(supabase db remote-url)" -f prisma/migrations/001_rls_policies.sql
```

### 8. Configure Authentication

1. **Go to Authentication > Providers** in Supabase dashboard
2. **Enable providers you want to use:**
   - Email (enabled by default)
   - Google OAuth
   - GitHub OAuth
3. **Configure OAuth providers** with your app credentials

### 9. Set Up Email Templates

1. **Go to Authentication > Email Templates** in Supabase dashboard
2. **Customize the templates:**
   - Confirm signup
   - Magic link
   - Change email address
   - Reset password

### 10. Test the Setup

```bash
# Start the development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to test your application.

## 🔐 Security Configuration

### Row-Level Security (RLS)

The project includes RLS policies that are automatically applied:

- **CoffeeShop**: Public read, owner write
- **Meetup**: Public/participant read, creator write
- **User**: Own profile only
- **Review**: Public read, owner write
- **Favorite**: Own favorites only

### Environment Variables Security

- ✅ **Never commit `.env.local`** to version control
- ✅ **Use different keys** for development and production
- ✅ **Rotate keys regularly**
- ✅ **Use service role key** only on the server side

## 📧 Email Configuration

### Resend Setup

1. **Verify your domain** in Resend dashboard
2. **Set up SPF and DKIM records**
3. **Test email delivery**

### Email Templates

The project includes beautiful email templates for:
- Welcome emails
- Meetup invitations
- Meetup reminders
- Meetup cancellations

## 🗄️ Database Management

### Prisma Studio

```bash
# Open Prisma Studio to manage data
npm run db:studio
```

### Database Migrations

```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

### Seeding Data

```bash
# Seed the database with sample data
npm run db:seed
```

## 🚀 Production Deployment

### Vercel Deployment

1. **Push your code to GitHub**
2. **Connect repository to Vercel**
3. **Set environment variables** in Vercel dashboard
4. **Deploy automatically** on push

### Environment Variables for Production

Make sure to set these in your production environment:

```env
NODE_ENV=production
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
RESEND_API_KEY=your-resend-api-key
EMAIL_FROM=noreply@yourdomain.com
```

## 🔍 Monitoring and Debugging

### Supabase Dashboard

- **Database**: Monitor queries and performance
- **Authentication**: View user sessions and events
- **Storage**: Manage file uploads
- **Edge Functions**: Monitor serverless functions
- **Logs**: View application logs

### Common Issues

#### Database Connection Issues
```bash
# Test database connection
psql "$(supabase db remote-url)" -c "SELECT version();"
```

#### Authentication Issues
1. Check environment variables
2. Verify OAuth provider configuration
3. Check email template setup

#### Email Issues
1. Verify Resend API key
2. Check domain verification
3. Test email delivery

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Resend Documentation](https://resend.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)

## 🆘 Support

If you encounter issues:

1. **Check the logs** in Supabase dashboard
2. **Verify environment variables**
3. **Test database connection**
4. **Check authentication setup**
5. **Review email configuration**

For additional help:
- [Supabase Discord](https://discord.supabase.com)
- [GitHub Issues](https://github.com/your-org/anemi-meets/issues)
- [Documentation](https://github.com/your-org/anemi-meets/wiki) 