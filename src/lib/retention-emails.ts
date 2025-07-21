export interface RetentionEmailTemplate {
  id: string
  subject: string
  title: string
  subtitle: string
  content: string
  ctaText: string
  ctaUrl: string
  trigger: 'inactive_3_days' | 'inactive_7_days' | 'inactive_14_days' | 'birthday' | 'achievement' | 'streak_reminder'
}

export const RETENTION_EMAILS: Record<string, RetentionEmailTemplate> = {
  WELCOME_BACK_3_DAYS: {
    id: 'welcome_back_3_days',
    subject: 'We hebben je gemist! ☕',
    title: 'Hey {name}!',
    subtitle: 'We hebben je de afgelopen dagen gemist',
    content: `
      <p>Het is al een paar dagen geleden dat je Anemi hebt gebruikt. 
      Misschien is het tijd voor een nieuwe koffie meetup?</p>
      
      <p>We hebben gemerkt dat je al {totalMeetups} meetups hebt georganiseerd - 
      dat is geweldig! Blijf je sociale netwerk uitbreiden.</p>
      
      <p>Hier zijn enkele cafes die je misschien leuk vindt:</p>
      <ul>
        <li>☕ {cafe1} - {distance1}km van je locatie</li>
        <li>☕ {cafe2} - {distance2}km van je locatie</li>
        <li>☕ {cafe3} - {distance3}km van je locatie</li>
      </ul>
    `,
    ctaText: 'Maak een nieuwe meetup',
    ctaUrl: '/create',
    trigger: 'inactive_3_days'
  },

  WELCOME_BACK_7_DAYS: {
    id: 'welcome_back_7_days',
    subject: 'Je streak is in gevaar! 🔥',
    title: 'Hey {name}!',
    subtitle: 'Je bent al een week niet actief geweest',
    content: `
      <p>We missen je! Het is al een week geleden dat je Anemi hebt gebruikt.</p>
      
      <p>Je streak van {streakDays} dagen is in gevaar. 
      Kom terug en blijf je sociale netwerk groeien!</p>
      
      <p>Wist je dat regelmatige meetups je helpen om:</p>
      <ul>
        <li>🤝 Nieuwe mensen te ontmoeten</li>
        <li>💼 Je netwerk uit te breiden</li>
        <li>☕ Nieuwe cafes te ontdekken</li>
        <li>🎯 Badges en prestaties te verdienen</li>
      </ul>
    `,
    ctaText: 'Herstel je streak',
    ctaUrl: '/dashboard',
    trigger: 'inactive_7_days'
  },

  WELCOME_BACK_14_DAYS: {
    id: 'welcome_back_14_days',
    subject: 'We willen je terug! 🎉',
    title: 'Hey {name}!',
    subtitle: 'Het is al twee weken geleden',
    content: `
      <p>We hopen dat alles goed met je gaat! Het is al twee weken geleden 
      dat je Anemi hebt gebruikt.</p>
      
      <p>Misschien heb je het druk gehad, maar we willen je graag terug zien!</p>
      
      <p>Speciaal voor jou hebben we:</p>
      <ul>
        <li>🎁 Een welkomst cadeau klaar</li>
        <li>🏆 Nieuwe badges om te verdienen</li>
        <li>☕ Nieuwe cafes toegevoegd</li>
        <li>👥 Meer actieve gebruikers</li>
      </ul>
      
      <p>Kom terug en ontdek wat er nieuw is!</p>
    `,
    ctaText: 'Kom terug naar Anemi',
    ctaUrl: '/',
    trigger: 'inactive_14_days'
  },

  BIRTHDAY_WISH: {
    id: 'birthday_wish',
    subject: '🎂 Happy Birthday {name}!',
    title: 'Gefeliciteerd! 🎉',
    subtitle: 'Vier je verjaardag met een speciale koffie meetup',
    content: `
      <p>Van harte gefeliciteerd met je verjaardag! 🎂</p>
      
      <p>Wat is er beter dan je verjaardag vieren met een speciale koffie meetup?</p>
      
      <p>Speciaal voor jou hebben we:</p>
      <ul>
        <li>🎁 Een verjaardags badge klaar</li>
        <li>☕ Extra XP voor je verjaardag</li>
        <li>🎉 Een speciale verjaardags meetup suggestie</li>
      </ul>
      
      <p>Maak vandaag een meetup en vier je verjaardag met nieuwe vrienden!</p>
    `,
    ctaText: 'Maak een verjaardags meetup',
    ctaUrl: '/create?special=birthday',
    trigger: 'birthday'
  },

  ACHIEVEMENT_UNLOCKED: {
    id: 'achievement_unlocked',
    subject: '🏆 Nieuwe prestatie verdiend!',
    title: 'Gefeliciteerd {name}!',
    subtitle: 'Je hebt een nieuwe badge verdiend',
    content: `
      <p>Fantastisch! Je hebt de "{achievementName}" badge verdiend! 🏆</p>
      
      <p>Je bent nu level {level} met {experiencePoints} XP. 
      Blijf groeien en verdien meer badges!</p>
      
      <p>Je prestaties tot nu toe:</p>
      <ul>
        <li>☕ {totalMeetups} meetups georganiseerd</li>
        <li>🔥 {streakDays} dagen streak</li>
        <li>⭐ {reviewsPosted} reviews gepost</li>
        <li>🏪 {favoriteCafes} cafes bezocht</li>
      </ul>
      
      <p>Ga zo door! Er zijn nog meer badges om te verdienen.</p>
    `,
    ctaText: 'Bekijk je prestaties',
    ctaUrl: '/dashboard',
    trigger: 'achievement'
  },

  STREAK_REMINDER: {
    id: 'streak_reminder',
    subject: '🔥 Je streak is in gevaar!',
    title: 'Hey {name}!',
    subtitle: 'Je bent al {streakDays} dagen actief',
    content: `
      <p>Geweldig! Je bent al {streakDays} dagen actief op Anemi! 🔥</p>
      
      <p>Je streak is indrukwekkend, maar we willen je helpen om het vol te houden.</p>
      
      <p>Vandaag is de perfecte dag om:</p>
      <ul>
        <li>☕ Een nieuwe meetup te organiseren</li>
        <li>👥 Je aan te sluiten bij een bestaande meetup</li>
        <li>⭐ Een review te schrijven</li>
        <li>🏪 Een nieuwe cafe te ontdekken</li>
      </ul>
      
      <p>Blijf je streak levend en verdien meer XP!</p>
    `,
    ctaText: 'Blijf actief',
    ctaUrl: '/dashboard',
    trigger: 'streak_reminder'
  }
}

export function personalizeEmailContent(
  template: RetentionEmailTemplate,
  userData: {
    name: string
    totalMeetups: number
    streakDays: number
    level: number
    experiencePoints: number
    reviewsPosted: number
    favoriteCafes: number
    achievementName?: string
    cafe1?: string
    cafe2?: string
    cafe3?: string
    distance1?: number
    distance2?: number
    distance3?: number
  }
): string {
  let content = template.content
  
  // Replace placeholders with actual data
  content = content.replace(/{name}/g, userData.name)
  content = content.replace(/{totalMeetups}/g, userData.totalMeetups.toString())
  content = content.replace(/{streakDays}/g, userData.streakDays.toString())
  content = content.replace(/{level}/g, userData.level.toString())
  content = content.replace(/{experiencePoints}/g, userData.experiencePoints.toString())
  content = content.replace(/{reviewsPosted}/g, userData.reviewsPosted.toString())
  content = content.replace(/{favoriteCafes}/g, userData.favoriteCafes.toString())
  
  if (userData.achievementName) {
    content = content.replace(/{achievementName}/g, userData.achievementName)
  }
  
  if (userData.cafe1) {
    content = content.replace(/{cafe1}/g, userData.cafe1)
    content = content.replace(/{distance1}/g, userData.distance1?.toString() || '0')
  }
  
  if (userData.cafe2) {
    content = content.replace(/{cafe2}/g, userData.cafe2)
    content = content.replace(/{distance2}/g, userData.distance2?.toString() || '0')
  }
  
  if (userData.cafe3) {
    content = content.replace(/{cafe3}/g, userData.cafe3)
    content = content.replace(/{distance3}/g, userData.distance3?.toString() || '0')
  }
  
  return content
} 