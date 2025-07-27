# AI Testing Agent Prompt voor Anemi Meets

## 🎯 Doel
Test de volledige Anemi Meets website als een echte gebruiker. Identificeer bugs, UX problemen, en functionaliteitskwesties.

## 📋 Test Scenario's

### 1. **Homepage & Navigatie**
```
- Ga naar de homepage (/)
- Controleer of alle links werken
- Test de navigatie tussen verschillende pagina's
- Controleer of de footer links correct werken
- Test de "Terug naar Home" knoppen
- Controleer of de login status correct wordt weergegeven
```

### 2. **Registratie & Login Flow**
```
- Test de nieuwe prominente "Registreer" knop op de login pagina
- Maak een nieuw account aan via /auth/signup
- Controleer of email verificatie werkt
- Test login met bestaand account
- Test "Wachtwoord vergeten" functionaliteit
- Controleer redirect functionaliteit na login
- Test logout functionaliteit
```

### 3. **Meetup Wizard (Belangrijkste Functionaliteit)**
```
- Ga naar /create en start een nieuwe meetup
- Test alle stappen van de wizard:
  * Stap 1: Naam en email invoer
  * Stap 2: Stad selectie
  * Stap 3: Datum en tijd selectie
  * Stap 4: Café keuze (test beide opties):
    - Random café selectie en acceptatie
    - Handmatige café selectie
  * Stap 5: Samenvatting en invite code generatie
- Controleer of de "Genereer Invite Code" knop correct werkt
- Test de invite modal en deel functionaliteit
```

### 4. **Café Selectie Validatie (Specifiek Testen)**
```
- Test random café flow:
  * Klik op "✅ Kies dit cafe" knop
  * Controleer of de "Genereer Invite Code" knop actief wordt
- Test handmatige café selectie:
  * Klik op "🔍 Zelf kiezen"
  * Selecteer een café uit de lijst
  * Controleer of de "Genereer Invite Code" knop actief wordt
- Test beide flows meerdere keren om consistentie te controleren
```

### 5. **Invite Systeem**
```
- Gebruik een gegenereerde invite link
- Test de invite pagina (/invite/[token])
- Test acceptatie van een meetup
- Test afwijzing van een meetup
- Controleer email notificaties
- Test het vinden van meetups via email
```

### 6. **Dashboard & Gebruikersprofiel**
```
- Ga naar /dashboard na login
- Controleer gebruikersstatistieken
- Test bijnaam wijzigen functionaliteit
- Controleer meetup geschiedenis
- Test account verwijderen functionaliteit
```

### 7. **Contact & Support Pagina's**
```
- Test /contact pagina:
  * Controleer of alle links werken
  * Test email links
  * Controleer FAQ sectie
- Test /system-status pagina:
  * Controleer of health status wordt weergegeven
  * Test auto-refresh functionaliteit
  * Controleer service status indicators
```

### 8. **Legal & Privacy**
```
- Test /legal/privacy pagina
- Test /legal/terms pagina
- Controleer of alle links in privacybeleid werken
```

### 9. **Error Handling & Edge Cases**
```
- Test 404 pagina's
- Test netwerk fouten
- Test ongeldige invite tokens
- Test expired meetups
- Controleer error messages en user feedback
```

### 10. **Responsive Design & Browser Compatibiliteit**
```
- Test op verschillende schermformaten
- Controleer mobile navigatie
- Test touch interacties
- Controleer loading states
```

## 🔍 Specifieke Test Punten

### Registratie Zichtbaarheid
```
- Controleer of de "Registreer" knop prominent zichtbaar is
- Test of de knop correct redirect naar signup pagina
- Controleer of redirect URL's correct worden doorgegeven
```

### Contact & System Status
```
- Controleer of /contact pagina laadt zonder 404
- Test of /system-status pagina real-time data toont
- Controleer of footer links correct werken
- Test email functionaliteit
```

### Café Selectie Validatie
```
- Test dat "Genereer Invite Code" knop altijd actief wordt na café selectie
- Controleer of random café acceptatie werkt
- Test of handmatige selectie consistent werkt
- Controleer of beide flows de finish knop activeren
```

## 📝 Test Rapportage

Voor elke test, rapporteer:

### ✅ Succesvolle Tests
```
- [ ] Functionaliteit werkt zoals verwacht
- [ ] UI/UX is consistent
- [ ] Performance is acceptabel
- [ ] Error handling werkt correct
```

### ❌ Gevonden Problemen
```
- [ ] Bug beschrijving
- [ ] Stappen om te reproduceren
- [ ] Verwacht gedrag vs. actueel gedrag
- [ ] Screenshots indien mogelijk
- [ ] Browser/device informatie
```

### 🔧 Verbeteringen
```
- [ ] UX verbeteringen
- [ ] Performance optimalisaties
- [ ] Accessibility verbeteringen
- [ ] Code kwaliteit suggesties
```

## 🚀 Test Uitvoering

### Stap 1: Setup
```
1. Open de website in een browser
2. Open browser developer tools
3. Zet network throttling aan voor realistische tests
4. Maak screenshots van belangrijke momenten
```

### Stap 2: Systematische Test
```
1. Start met homepage en navigatie
2. Test registratie/login flow
3. Test meetup wizard volledig
4. Test invite systeem
5. Test dashboard functionaliteit
6. Test contact en support pagina's
7. Test error scenarios
8. Test responsive design
```

### Stap 3: Rapportage
```
1. Maak een gedetailleerd rapport
2. Categoriseer problemen per prioriteit
3. Geef specifieke aanbevelingen
4. Voeg screenshots toe waar nodig
5. Test fixes indien mogelijk
```

## 🎯 Specifieke Focus Punten

### Registratie Verbetering
- Controleer of nieuwe gebruikers de registratie optie duidelijk zien
- Test of de knop consistent is met huisstijl
- Verifieer dat redirect functionaliteit correct werkt

### 404 Fixes
- Test alle footer links
- Controleer contact pagina functionaliteit
- Test system status pagina
- Verifieer dat geen broken links zijn

### Café Selectie Fix
- Test beide café selectie flows
- Controleer dat validatie consistent werkt
- Verifieer dat finish knop altijd correct wordt geactiveerd
- Test edge cases (geen café beschikbaar, etc.)

## 📊 Success Criteria

De test is succesvol als:
- [ ] Alle core functionaliteiten werken
- [ ] Geen 404 errors op belangrijke pagina's
- [ ] Registratie knop is prominent zichtbaar
- [ ] Café selectie werkt in beide flows
- [ ] UI/UX is consistent en gebruiksvriendelijk
- [ ] Error handling is robuust
- [ ] Performance is acceptabel

## 🔄 Continuous Testing

Na elke deployment:
1. Run deze test suite
2. Documenteer alle veranderingen
3. Update test cases indien nodig
4. Verifieer dat fixes werken
5. Test regressies

---

**Gebruik deze prompt om systematisch de hele website te testen en een gedetailleerd rapport te maken van alle bevindingen.** 