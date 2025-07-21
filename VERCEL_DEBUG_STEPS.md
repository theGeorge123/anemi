# 🔍 Vercel Debug Steps

## 📋 Stap 1: Controleer Vercel Environment Variables

1. **Ga naar Vercel Dashboard**
2. **Selecteer je project**
3. **Ga naar Settings > Environment Variables**
4. **Controleer of deze variables bestaan:**

### ✅ Verplichte Variables:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://cceqmxxtjbuxbznatskj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjZXFteHh0amJ1eGJ6bmF0c2tqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNzE1MDYsImV4cCI6MjA2Njg0NzUwNn0.ZWAOpEoirnszXj0Pw91SGnA03HxW0eBvU8GIoH4OEXI
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjZXFteHh0amJ1eGJ6bmF0c2tqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTI3MTUwNiwiZXhwIjoyMDY2ODQ3NTA2fQ._Q_Mj4QPyCyQHVZPzBCaD991cgN4CssQ3iy_PcM-PF0
DATABASE_URL=postgresql://postgres.cceqmxxtjbuxbznatskj:xohhit-jizwif-0zoWcy@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
RESEND_API_KEY=re_5qwUzMsy_PdsXke5gM52LGbUFMG91HY3m
EMAIL_FROM=team@anemimeets.com
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app
```

### ⚠️ Belangrijk:
- **Environment**: Zorg dat "Production" is geselecteerd
- **NEXT_PUBLIC_SITE_URL**: Verander naar je echte Vercel domain

## 📋 Stap 2: Controleer Supabase Settings

1. **Ga naar Supabase Dashboard**
2. **Selecteer je project**
3. **Ga naar Settings > API**
4. **Controleer:**
   - Project URL: `https://cceqmxxtjbuxbznatskj.supabase.co`
   - Anon Key: Begint met `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📋 Stap 3: Controleer Supabase Auth Settings

1. **Ga naar Authentication > Settings**
2. **Controleer Site URL:**
   - Moet zijn: `https://your-vercel-domain.vercel.app`
3. **Controleer Redirect URLs:**
   - `https://your-vercel-domain.vercel.app/auth/callback`
   - `https://your-vercel-domain.vercel.app/auth/signin`
   - `https://your-vercel-domain.vercel.app/auth/signup`

## 📋 Stap 4: Test de Debug Page

1. **Deploy de nieuwe code**
2. **Ga naar:** `https://your-vercel-domain.vercel.app/debug-vercel`
3. **Controleer de output**

## 📋 Stap 5: Wat te zoeken in Debug Output

### ✅ Goede Output:
```json
{
  "environment": {
    "VERCEL": "1",
    "VERCEL_URL": "your-domain.vercel.app"
  },
  "supabase": {
    "url": "✅ Set",
    "anonKey": "✅ Set"
  },
  "connection": {
    "supabaseClient": "✅ Created",
    "validationResult": { "success": true }
  }
}
```

### ❌ Slechte Output:
```json
{
  "supabase": {
    "url": "❌ Missing",
    "anonKey": "❌ Missing"
  },
  "connection": {
    "supabaseClient": "❌ Failed"
  }
}
```

## 📋 Stap 6: Als het nog steeds niet werkt

### 🔄 Probeer deze stappen:

1. **Clear Vercel Cache:**
   - Ga naar Vercel Dashboard > Settings > General
   - Scroll naar "Build & Development Settings"
   - Klik "Clear Build Cache"

2. **Redeploy:**
   - Ga naar Deployments
   - Klik "Redeploy" op de laatste deployment

3. **Check Vercel Logs:**
   - Ga naar Functions tab
   - Klik op een deployment
   - Check de logs voor errors

## 📋 Stap 7: Common Issues

### Issue 1: "No API key found in request"
**Oplossing:** Controleer of `NEXT_PUBLIC_SUPABASE_ANON_KEY` correct is ingesteld

### Issue 2: "Invalid login credentials"
**Oplossing:** Controleer Supabase Auth settings en Site URL

### Issue 3: Environment variables not loading
**Oplossing:** 
1. Controleer of variables "Production" environment hebben
2. Redeploy na het toevoegen van variables

## 📋 Stap 8: Final Test

Na alle fixes:
1. Ga naar: `https://your-vercel-domain.vercel.app/debug-vercel`
2. Controleer of alles ✅ groen is
3. Probeer in te loggen op: `https://your-vercel-domain.vercel.app/auth/signin`

## 🆘 Als niets werkt

Stuur me de output van `/debug-vercel` en ik help je verder! 