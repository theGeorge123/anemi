# 🤖 Comprehensive AI Testing Prompt voor Anemi Meets

## 🎯 Doel
Test de volledige Anemi Meets applicatie als een AI agent, inclusief GitHub repository analyse, code kwaliteit, en end-to-end website functionaliteit.

---

## 📋 Test Fases

### Fase 1: GitHub Repository Analyse

#### 1.1 Repository Structuur & Bestanden
```
- Controleer of alle belangrijke bestanden aanwezig zijn:
  * package.json met alle dependencies
  * next.config.js voor Next.js configuratie
  * tailwind.config.js voor styling
  * prisma/schema.prisma voor database schema
  * .env.example voor environment variables
  * README.md met setup instructies
  * tsconfig.json voor TypeScript configuratie
  * jest.config.js voor testing setup
```

#### 1.2 Code Kwaliteit Analyse
```
- Controleer TypeScript configuratie en type safety
- Analyseer component structuur in src/components/
- Controleer API routes in src/app/api/
- Verifieer database schema en migrations
- Controleer test coverage en test bestanden
- Analyseer error handling en logging
- Controleer security implementaties (RLS, auth, etc.)
```

#### 1.3 Dependencies & Configuratie
```
- Controleer package.json voor:
  * Alle benodigde dependencies
  * Correcte versies
  * Security vulnerabilities
  * Development vs production dependencies
- Verifieer environment variables setup
- Controleer build scripts en deployment configuratie
```

### Fase 2: Lokale Development Setup

#### 2.1 Environment Setup
```
1. Clone repository en installeer dependencies:
   git clone [repository-url]
   cd anemi
   npm install

2. Setup environment variables:
   cp .env.example .env.local
   Vul alle benodigde environment variables in

3. Setup database:
   npm run db:push
   npm run db:seed (indien beschikbaar)

4. Start development server:
   npm run dev
```

#### 2.2 Build & Test Verificatie
```
- Test build proces: npm run build
- Controleer TypeScript compilatie: npm run type-check
- Run tests: npm run test
- Controleer linting: npm run lint
- Test database connectie
- Verifieer API endpoints functionaliteit
```

### Fase 3: Website Functionaliteit Testing

#### 3.1 Homepage & Navigatie
```
- Test homepage laadt correct (http://localhost:3000/)
- Controleer alle navigatie links werken
- Test responsive design op verschillende schermformaten
- Verifieer footer links en functionaliteit
- Controleer logo en branding elementen
- Test language switcher (NL/EN)
```

#### 3.2 Authenticatie Flow
```
- Test registratie proces (/auth/signup):
  * Form validatie
  * Email verificatie
  * Password strength indicator
  * Error handling
  * Success redirect

- Test login proces (/auth/signin):
  * Form validatie
  * Error handling
  * Remember me functionaliteit
  * Password reset flow

- Test logout functionaliteit
- Controleer session management
- Test protected routes
```

#### 3.3 Meetup Creation Wizard
```
- Test volledige meetup creation flow (/create):
  * Stap 1: Naam en email invoer
  * Stap 2: Stad selectie (Amsterdam, Rotterdam, etc.)
  * Stap 3: Datum en tijd selectie
  * Stap 4: Café keuze (random vs handmatig)
  * Stap 5: Samenvatting en invite code

- Controleer form validatie op elke stap
- Test navigatie tussen stappen
- Verifieer data persistence
- Test invite code generatie
- Controleer email notificaties
```

#### 3.4 Invite Systeem
```
- Test invite link functionaliteit (/invite/[token])
- Verifieer invite pagina layout en informatie
- Test acceptatie flow:
  * Date/time selectie
  * Confirmation email
  * Calendar integration
- Test afwijzing flow:
  * Reason input
  * Notification email
- Test "Find My Meetups" functionaliteit
```

#### 3.5 Dashboard & User Management
```
- Test dashboard functionaliteit (/dashboard):
  * User statistics
  * Meetup history
  * Account management
  * Nickname editing
  * Data deletion request

- Controleer real-time updates
- Test data persistence
- Verifieer user permissions
```

#### 3.6 API Endpoints Testing
```
- Test alle API endpoints:
  * /api/health - Health check
  * /api/cafes - Café data
  * /api/auth/* - Authentication endpoints
  * /api/meetups/* - Meetup management
  * /api/invite/* - Invite system
  * /api/user/* - User management

- Controleer response formats
- Test error handling
- Verifieer authentication requirements
- Test rate limiting
```

### Fase 4: Email & Notificatie Testing

#### 4.1 Email Functionaliteit
```
- Test alle email types:
  * Welcome email
  * Invite email
  * Confirmation email
  * Cancellation email
  * Calendar invite
  * Reminder email

- Gebruik debug email tool (/debug-email)
- Controleer email templates
- Verifieer email delivery
- Test email links functionaliteit
```

#### 4.2 Notificatie Systeem
```
- Test real-time notificaties
- Controleer browser notifications
- Test email notificaties
- Verifieer notification preferences
```

### Fase 5: Error Handling & Edge Cases

#### 5.1 Error Scenarios
```
- Test 404 pagina's
- Test 500 errors
- Test network failures
- Test invalid invite tokens
- Test expired meetups
- Test malformed data
- Test authentication errors
```

#### 5.2 Edge Cases
```
- Test met lege data
- Test met zeer lange inputs
- Test met speciale karakters
- Test concurrent users
- Test rapid form submissions
- Test browser back/forward
```

### Fase 6: Performance & Security

#### 6.1 Performance Testing
```
- Controleer page load times
- Test image optimization
- Verifieer code splitting
- Test caching strategies
- Controleer bundle size
- Test mobile performance
```

#### 6.2 Security Testing
```
- Controleer authentication security
- Test authorization policies
- Verifieer data validation
- Test SQL injection prevention
- Controleer XSS protection
- Test CSRF protection
- Verifieer environment variable security
```

### Fase 7: Cross-Browser & Device Testing

#### 7.1 Browser Compatibiliteit
```
- Test op Chrome (latest)
- Test op Firefox (latest)
- Test op Safari (latest)
- Test op Edge (latest)
- Controleer JavaScript errors
- Verifieer CSS rendering
```

#### 7.2 Device Testing
```
- Test op desktop (1920x1080)
- Test op tablet (768px width)
- Test op mobile (375px width)
- Controleer touch interactions
- Test viewport scaling
- Verifieer mobile navigation
```

---

## 📊 Test Rapportage Format

### Voor Elke Test Fase:

```
## Test Fase: [Naam]

### ✅ Succesvolle Tests
- [Lijst van werkende functionaliteiten]

### ❌ Gevonden Problemen
- [Lijst van problemen met severity]

### 🔧 Aanbevelingen
- [Verbeteringen en suggesties]

### 📈 Metrics
- [Performance metrics]
- [Error rates]
- [User experience scores]
```

### Eind Rapport:

```
## 🎯 Comprehensive Test Rapport

### 📁 Repository Status
- [ ] Code kwaliteit
- [ ] Dependencies
- [ ] Configuration
- [ ] Documentation

### 🌐 Website Status
- [ ] Core functionaliteit
- [ ] User flows
- [ ] API endpoints
- [ ] Email systeem
- [ ] Error handling
- [ ] Performance
- [ ] Security

### 📱 Device/Browser Status
- [ ] Desktop browsers
- [ ] Mobile devices
- [ ] Responsive design
- [ ] Touch interactions

### 🚀 Deployment Readiness
- [ ] Build process
- [ ] Environment setup
- [ ] Database migrations
- [ ] Production configuratie

### 🎉 Overall Assessment
- [Overall score en aanbevelingen]
```

---

## 🚨 Kritieke Test Punten

### Moet Werken:
- [ ] Homepage laadt zonder errors
- [ ] Registratie/login flow werkt
- [ ] Meetup creation wizard werkt volledig
- [ ] Invite systeem functioneert
- [ ] Email notificaties worden verzonden
- [ ] Dashboard toont correcte data
- [ ] Mobile responsive design
- [ ] Error handling werkt
- [ ] API endpoints reageren correct
- [ ] Database operaties werken

### Veelvoorkomende Problemen:
- [ ] Environment variables niet geconfigureerd
- [ ] Database connectie problemen
- [ ] Email service niet werkend
- [ ] Authentication errors
- [ ] Mobile layout issues
- [ ] API endpoint errors
- [ ] Build failures
- [ ] TypeScript errors

---

## 🎯 Test Uitvoering Checklist

### Voor Start:
- [ ] Repository gecloned
- [ ] Dependencies geïnstalleerd
- [ ] Environment variables geconfigureerd
- [ ] Database setup voltooid
- [ ] Development server draait
- [ ] Browser developer tools open

### Tijdens Testing:
- [ ] Systematisch elke fase testen
- [ ] Screenshots maken van problemen
- [ ] Console errors documenteren
- [ ] Network requests monitoren
- [ ] Performance metrics verzamelen
- [ ] User flows volledig testen

### Na Testing:
- [ ] Volledig rapport maken
- [ ] Problemen categoriseren
- [ ] Aanbevelingen formuleren
- [ ] Fixes voorstellen
- [ ] Deployment checklist controleren

---

**Gebruik deze prompt om een complete, systematische test uit te voeren van zowel de GitHub repository als de website functionaliteit. Documenteer alle bevindingen en geef specifieke aanbevelingen voor verbeteringen.** 