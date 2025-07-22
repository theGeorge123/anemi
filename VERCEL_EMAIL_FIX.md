# 🚀 Vercel Email Verification Fix Guide

## **🔍 Probleem Diagnose**

Als email verificatie niet werkt op Vercel, volg deze stappen:

### **1. Check Environment Variables op Vercel**

**Ga naar Vercel Dashboard > Your Project > Settings > Environment Variables:**

#### **✅ Vereiste Variables:**
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app
RESEND_API_KEY=re_your-resend-key (optioneel)
EMAIL_FROM=noreply@yourdomain.com (optioneel)
```

### **2. Check Supabase Email Settings**

**Ga naar Supabase Dashboard > Authentication > Email Templates:**

#### **✅ Confirmation Email Template:**
```html
<h2>Welcome to Anemi Meets! 🎉</h2>
<p>Please verify your email to start your coffee adventure.</p>
<a href="{{ .SiteURL }}/auth/verify?token_hash={{ .TokenHash }}&type=email">Verify Email</a>
```

#### **✅ URL Configuration:**
**Authentication > URL Configuration:**
- **Site URL:** `https://your-vercel-domain.vercel.app`
- **Redirect URLs:**
  ```
  https://your-vercel-domain.vercel.app/auth/callback
  https://your-vercel-domain.vercel.app/auth/verify
  https://your-vercel-domain.vercel.app/confirmed
  ```

### **3. Test de Configuratie**

**Ga naar:** `https://your-vercel-domain.vercel.app/debug-vercel-email`

1. **Klik "Check Environment"** - Zie welke variables missen
2. **Test een signup** - Zie of emails worden verzonden
3. **Check de resultaten** - Identificeer het probleem

### **4. Veelvoorkomende Problemen & Oplossingen**

#### **❌ Probleem: "NEXT_PUBLIC_SITE_URL is missing"**
**Oplossing:**
```bash
# In Vercel Dashboard, voeg toe:
NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app
```

#### **❌ Probleem: "Emails worden niet verzonden"**
**Oplossing:**
1. **Check Supabase SMTP settings**
2. **Gebruik Resend voor betere delivery:**
   - Ga naar [resend.com](https://resend.com)
   - Maak account en haal API key
   - Voeg toe aan Vercel: `RESEND_API_KEY=re_your-key`

#### **❌ Probleem: "Verificatie link werkt niet"**
**Oplossing:**
1. **Check email template** - Moet `{{ .SiteURL }}` gebruiken
2. **Check redirect URLs** - Moet je Vercel domain bevatten
3. **Test de link** - Ga naar `/debug-vercel-email`

#### **❌ Probleem: "Wrong domain in emails"**
**Oplossing:**
1. **Update Site URL** in Supabase naar je Vercel domain
2. **Update redirect URLs** naar je Vercel domain
3. **Redeploy** je Vercel app

### **5. Resend SMTP Setup (Aanbevolen)**

#### **Stap 1: Resend Account**
1. Ga naar [resend.com](https://resend.com)
2. Maak account en verifieer je domain
3. Haal je API key op

#### **Stap 2: Vercel Environment**
```bash
RESEND_API_KEY=re_your-api-key-here
EMAIL_FROM=noreply@yourdomain.com
```

#### **Stap 3: Supabase SMTP**
**Authentication > Email Templates > SMTP Settings:**
- **Host:** `smtp.resend.com`
- **Port:** `587`
- **Username:** `resend`
- **Password:** `re_your-api-key-here`
- **Security:** `STARTTLS`

### **6. Debug Commands**

#### **Check Environment:**
```bash
# Ga naar je Vercel deployment
https://your-domain.vercel.app/debug-vercel-email
```

#### **Test Email Flow:**
```bash
# Test signup
https://your-domain.vercel.app/test-email-verification
```

#### **Manual Verification:**
```bash
# Als verificatie link niet werkt
https://your-domain.vercel.app/debug-confirm-email
```

### **7. Vercel Deployment Checklist**

#### **✅ Voor Deployment:**
- [ ] Alle environment variables zijn ingesteld
- [ ] Supabase Site URL is correct
- [ ] Redirect URLs bevatten Vercel domain
- [ ] Email template gebruikt `{{ .SiteURL }}`

#### **✅ Na Deployment:**
- [ ] Test signup op Vercel domain
- [ ] Check of email wordt verzonden
- [ ] Test verificatie link
- [ ] Check of redirect werkt

### **8. Emergency Fixes**

#### **Als niets werkt:**
1. **Gebruik manual confirmation:**
   - Ga naar `/debug-confirm-email`
   - Voer email in en confirm handmatig

2. **Check Supabase logs:**
   - Ga naar Supabase Dashboard > Logs
   - Zoek naar auth events

3. **Reset environment:**
   - Delete alle environment variables
   - Voeg ze opnieuw toe
   - Redeploy

### **9. Support**

**Als het nog steeds niet werkt:**
1. **Check de debug pagina** voor specifieke errors
2. **Test op localhost** eerst
3. **Vergelijk local vs Vercel** environment
4. **Check Supabase logs** voor auth errors

---

**🎯 Succes!** Na deze stappen zou email verificatie moeten werken op Vercel. 