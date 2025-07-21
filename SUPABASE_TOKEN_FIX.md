# 🔧 Fix: Stale Supabase Auth Token

## 🚨 Het Probleem
Je krijgt `AuthApiError: Invalid login credentials` omdat er een oude auth token van localhost in je browser staat die niet meer geldig is voor de Vercel domain.

## 🛠️ Oplossing

### Stap 1: Clear Browser Data

**Voor Chrome/Edge:**
1. Open DevTools (F12)
2. Ga naar **Application** tab
3. Ga naar **Storage** > **Cookies** > **your-vercel-domain.vercel.app**
4. **Zoek en verwijder** alle cookies die beginnen met `sb-cceqmxxtjbuxbznatskj-auth-token`
5. Ga naar **Local Storage** > **your-vercel-domain.vercel.app**
6. **Klik "Clear"** of verwijder alle items

**Voor Firefox:**
1. Open DevTools (F12)
2. Ga naar **Storage** tab
3. Ga naar **Cookies** > **your-vercel-domain.vercel.app**
4. **Zoek en verwijder** alle cookies die beginnen met `sb-cceqmxxtjbuxbznatskj-auth-token`
5. Ga naar **Local Storage** > **your-vercel-domain.vercel.app**
6. **Klik "Clear"**

### Stap 2: Clear All Browser Data (Alternatief)

**Snelle fix:**
1. **Ctrl/Cmd + Shift + Delete**
2. **Selecteer:**
   - Cookies and other site data
   - Cached images and files
3. **Time range:** "All time"
4. **Klik "Clear data"**

### Stap 3: Hard Refresh

**Na het clearen:**
1. **Ctrl/Cmd + Shift + R** (hard refresh)
2. **Of** Ctrl/Cmd + F5

### Stap 4: Test

1. Ga naar: `https://your-vercel-domain.vercel.app/auth/signin`
2. Probeer in te loggen
3. Het zou nu moeten werken!

## 🔍 Waarom gebeurt dit?

- **Lokale development** gebruikt `localhost:3000`
- **Vercel deployment** gebruikt `your-domain.vercel.app`
- **Supabase tokens** zijn domain-specific
- **Oude tokens** van localhost werken niet op Vercel domain
- **Browser cache** houdt oude tokens vast

## 🛡️ Voorkomen in de toekomst

### Voor Developers:
```javascript
// In je Supabase config
auth: {
  persistSession: true,
  autoRefreshToken: true,
  detectSessionInUrl: true,
  // Voeg toe:
  storage: {
    getItem: (key) => {
      // Check domain
      if (window.location.hostname !== 'localhost') {
        // Clear old tokens on production
        localStorage.removeItem(key);
      }
      return localStorage.getItem(key);
    }
  }
}
```

### Voor Users:
- **Incognito/Private mode** gebruiken voor testing
- **Clear browser data** regelmatig tijdens development
- **Hard refresh** na domain changes

## 🧪 Test Script

Voeg dit toe aan je debug page om tokens te checken:

```javascript
// Check voor oude tokens
const oldTokens = Object.keys(localStorage).filter(key => 
  key.includes('sb-') && key.includes('auth-token')
);
console.log('Oude tokens gevonden:', oldTokens);
```

## ✅ Success Indicators

Na de fix zou je moeten zien:
- ✅ Geen `AuthApiError: Invalid login credentials`
- ✅ Geen `"No API key found in request"`
- ✅ Succesvol inloggen op Vercel
- ✅ Debug page toont alle ✅ groene checks

## 🆘 Als het nog steeds niet werkt

1. **Check de debug page:** `/debug-vercel`
2. **Controleer Vercel environment variables**
3. **Controleer Supabase Auth settings**
4. **Stuur me de debug output**

Dit zou het probleem moeten oplossen! 🚀 