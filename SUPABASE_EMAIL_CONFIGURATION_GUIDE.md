# 🔧 Supabase Email Template Configuration Guide

## 🎯 Doel
Configureer de Supabase email template voor password reset functionaliteit volgens de instructies in `SUPABASE_PASSWORD_RESET_FIX.md`.

## 📋 Stappen

### Stap 1: Ga naar Supabase Dashboard
1. Bezoek [supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecteer je project (Anemi Meets)

### Stap 2: Ga naar Authentication > Email Templates
1. Klik op **Authentication** in de sidebar
2. Klik op **Email Templates** tab

### Stap 3: Configureer "Reset Password" Template
1. Klik op **Reset Password** template
2. Update de template met deze content:

```html
<h2>Reset Your Password</h2>
<p>Hello,</p>
<p>You have requested to reset your password for your Anemi Meets account.</p>
<p>Click the link below to reset your password:</p>
<p><a href="{{ .ConfirmationURL }}">Reset Password</a></p>
<p>If you didn't request this password reset, you can safely ignore this email.</p>
<p>This link will expire in 24 hours.</p>
<p>Best regards,<br>Anemi Meets Team</p>
```

### Stap 4: Update Email Subject
- Zet het onderwerp op: `Reset Your Password - Anemi Meets`

### Stap 5: Check Site URL Configuration
1. Ga naar **Authentication > URL Configuration**
2. **Site URL**: Moet zijn `https://www.anemimeets.com`
3. **Redirect URLs**: Zorg dat deze URLs zijn toegevoegd:
   ```
   https://www.anemimeets.com/auth/callback
   https://www.anemimeets.com/auth/reset-password
   https://www.anemimeets.com/confirmed
   ```

### Stap 6: Verificeer Email Settings
1. Ga naar **Authentication > Settings**
2. **Enable email confirmations**: ✅ Moet enabled zijn
3. **Enable email change confirmations**: ✅ Moet enabled zijn
4. **Enable secure email change**: ✅ Moet enabled zijn

## 🧪 Test de Configuratie

### Test de password reset flow:
1. Ga naar `/auth/forgot-password`
2. Voer een geldig email adres in
3. Submit het formulier
4. Check je email voor de reset link
5. Klik op de link om de reset pagina te testen

### Verwacht gedrag:
- Email moet onderwerp hebben "Reset Your Password - Anemi Meets"
- Email moet een reset link bevatten
- Klikken op de link moet je naar `/auth/reset-password` brengen
- Je moet een nieuw wachtwoord kunnen instellen

## 🔍 Debug Stappen

### Als de email template niet werkt:

1. **Verificeer template variabelen**:
   - `{{ .ConfirmationURL }}` moet gebruikt worden voor de reset link
   - `{{ .Email }}` kan gebruikt worden om het email adres te tonen
   - `{{ .SiteURL }}` kan gebruikt worden voor je site URL

2. **Test met verschillende email providers**:
   - Gmail
   - Outlook
   - Yahoo
   - Check spam folders

### Check API Implementatie

De API route `/api/auth/send-password-reset` gebruikt nu:
```typescript
const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/reset-password`
})
```

Dit zou de juiste password reset email template moeten versturen.

### Check Reset Page

De reset page `/auth/reset-password` controleert nu:
- Voor een geldige sessie (gezet door de reset link)
- Toont een error als de link ongeldig is
- Laat het instellen van een nieuw wachtwoord toe als de link geldig is

## 🚨 Veelvoorkomende Problemen

### Probleem 1: Krijg nog steeds verificatie email
**Oplossing**: Zorg dat je `resetPasswordForEmail` gebruikt in plaats van `generateLink` met type 'recovery'

### Probleem 2: Reset link werkt niet
**Oplossing**: 
- Check dat de redirect URL correct is in Supabase settings
- Verificeer dat de email template `{{ .ConfirmationURL }}` gebruikt
- Zorg dat de reset page controleert voor een geldige sessie

### Probleem 3: User not found error
**Oplossing**: 
- De API handelt dit nu correct af
- Toont een gebruiksvriendelijke error message
- Retourneert 404 status code

## 📧 Email Template Best Practices

1. **Duidelijke onderwerpregel**: "Reset Your Password - Anemi Meets"
2. **Duidelijke call to action**: "Reset Password" knop
3. **Security notice**: Vermeld dat de link verloopt
4. **Branding**: Include je app naam
5. **Fallback**: Vermeld wat te doen als ze het niet hebben aangevraagd

## 🔄 Test Checklist

- [ ] Password reset form werkt
- [ ] Email wordt verstuurd met correct onderwerp
- [ ] Email bevat reset link
- [ ] Reset link redirect naar juiste pagina
- [ ] Reset page toont formulier voor geldige links
- [ ] Reset page toont error voor ongeldige links
- [ ] Nieuw wachtwoord kan worden ingesteld
- [ ] User kan inloggen met nieuw wachtwoord
- [ ] Error handling werkt voor niet-bestaande users

## 🎯 Verwacht Flow

1. User klikt "Wachtwoord vergeten?"
2. User voert email in en submit
3. API roept `resetPasswordForEmail` aan
4. Supabase verstuurt password reset email
5. User klikt op link in email
6. User landt op `/auth/reset-password`
7. User stelt nieuw wachtwoord in
8. User wordt geredirect naar login pagina
9. User kan inloggen met nieuw wachtwoord

Dit zou nu correct moeten werken met de juiste password reset email template! 