# 🚀 Deploy Anemi Meets to Supabase

## Quick Setup

### 1. Run Automated Setup
```bash
./setup-supabase.sh
```

### 2. Manual Setup Steps

1. **Install dependencies**: `npm install`
2. **Create Supabase project** at [supabase.com](https://supabase.com)
3. **Get credentials** from Settings > API
4. **Update `.env.local`** with your credentials
5. **Initialize Supabase**: `supabase init && supabase login`
6. **Link project**: `supabase link --project-ref YOUR_REF`
7. **Deploy schema**: `npx prisma db push`
8. **Apply RLS**: `psql "$(supabase db remote-url)" -f prisma/migrations/001_rls_policies.sql`
9. **Start dev server**: `npm run dev`

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Resend Email
RESEND_API_KEY="your-resend-api-key"
EMAIL_FROM="noreply@anemi-meets.com"

# Maps
GOOGLE_MAPS_API_KEY="your-google-maps-key"
MAPBOX_ACCESS_TOKEN="your-mapbox-token"
```

## Features Included

✅ **Supabase Auth** - Social login, magic links  
✅ **Row-Level Security** - Database-level access control  
✅ **Resend Email** - Beautiful email templates  
✅ **Soft Deletes** - Preserve data while hiding cancelled events  
✅ **Location Services** - Optimized spatial queries  
✅ **Mobile-First** - Responsive PWA design  

## Next Steps

1. Configure OAuth providers in Supabase dashboard
2. Set up email templates in Supabase dashboard
3. Verify your domain in Resend dashboard
4. Add Google Maps and Mapbox API keys
5. Deploy to Vercel for production

## Support

- [Supabase Docs](https://supabase.com/docs)
- [Resend Docs](https://resend.com/docs)
- [GitHub Issues](https://github.com/your-org/anemi-meets/issues) 