# 🔧 Complete Token Fix Solution

## 🚨 Het Probleem
Je krijgt `AuthApiError: Invalid login credentials` omdat er oude Supabase auth tokens van localhost in je browser staan die niet meer werken op de Vercel domain.

## 🛠️ Oplossingen Geïmplementeerd

### 1. **Automatische Token Cleanup** ✅
- **Bestand:** `src/lib/supabase-browser.ts`
- **Functie:** `customStorage` 
- **Werking:** Automatisch detecteert en verwijdert oude tokens wanneer je van localhost naar production gaat

### 2. **Handmatige Token Cleanup** ✅
- **Bestand:** `src/lib/supabase-browser.ts`
- **Functie:** `clearStaleTokens()`
- **Werking:** Verwijdert alle Supabase localStorage items en cookies

### 3. **One-Click Fix Page** ✅
- **URL:** `/fix-tokens`
- **Werking:** Automatische cleanup + redirect naar login

### 4. **Debug Tools** ✅
- **URL:** `/debug-vercel`
- **Werking:** Toont alle environment variables en connection status

## 🚀 Hoe te gebruiken

### **Optie 1: Automatische Fix (Aanbevolen)**
1. Ga naar: `https://your-vercel-domain.vercel.app/fix-tokens`
2. Klik op "🧹 Clear All Stale Tokens"
3. Wacht 3 seconden voor automatische redirect
4. Probeer in te loggen

### **Optie 2: Manual Fix**
1. Open DevTools (F12)
2. Application tab > Storage > Local Storage
3. Verwijder alle items die beginnen met "sb-"
4. Application tab > Storage > Cookies  
5. Verwijder alle cookies die beginnen met "sb-"
6. Hard refresh (Ctrl/Cmd + Shift + R)

### **Optie 3: Browser Data Clear**
1. Ctrl/Cmd + Shift + Delete
2. Selecteer "Cookies and other site data"
3. Time range: "All time"
4. Klik "Clear data"

## 🔍 Debug & Monitoring

### **Check Environment Variables:**
- Ga naar: `/debug-vercel`
- Controleer of alle variables ✅ groen zijn

### **Check Token Status:**
```javascript
// In browser console
const tokens = Object.keys(localStorage).filter(key => 
  key.includes('sb-') || key.includes('supabase')
);
console.log('Supabase tokens:', tokens);
```

## ✅ Success Indicators

Na de fix zou je moeten zien:
- ✅ Geen `AuthApiError: Invalid login credentials`
- ✅ Geen `"No API key found in request"`
- ✅ Succesvol inloggen op Vercel
- ✅ Debug page toont alle ✅ groene checks

## 🛡️ Voorkomen in de toekomst

### **Voor Developers:**
- De `customStorage` functie voorkomt automatisch stale tokens
- Gebruik incognito mode voor testing
- Clear browser data regelmatig tijdens development

### **Voor Users:**
- De automatische cleanup werkt nu altijd
- Geen handmatige interventie meer nodig

## 🆘 Als het nog steeds niet werkt

1. **Check de debug page:** `/debug-vercel`
2. **Controleer Vercel environment variables**
3. **Controleer Supabase Auth settings**
4. **Stuur me de debug output**

## 📋 Vercel Environment Variables Checklist

Zorg dat je deze hebt in Vercel Dashboard > Settings > Environment Variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://cceqmxxtjbuxbznatskj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres.cceqmxxtjbuxbznatskj:...
RESEND_API_KEY=re_5qwUzMsy_PdsXke5gM52LGbUFMG91HY3m
EMAIL_FROM=team@anemimeets.com
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app
```

**Dit zou het probleem definitief moeten oplossen!** 🚀 