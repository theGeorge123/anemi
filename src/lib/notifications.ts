export interface NotificationTemplate {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'reminder'
  priority: 'low' | 'medium' | 'high'
  trigger: 'immediate' | 'scheduled' | 'conditional'
  conditions?: Record<string, any>
}

export const NOTIFICATION_TEMPLATES: Record<string, NotificationTemplate> = {
  WELCOME_BACK: {
    id: 'welcome_back',
    title: 'Welkom terug! ☕',
    message: 'We hebben je gemist! Tijd voor een nieuwe koffie meetup?',
    type: 'reminder',
    priority: 'medium',
    trigger: 'conditional',
    conditions: { daysInactive: 7 }
  },
  
  STREAK_REMINDER: {
    id: 'streak_reminder',
    title: '🔥 Je streak is in gevaar!',
    message: 'Je bent al 3 dagen actief. Blijf je streak levend!',
    type: 'reminder',
    priority: 'high',
    trigger: 'conditional',
    conditions: { streakDays: 3 }
  },
  
  NEW_ACHIEVEMENT: {
    id: 'new_achievement',
    title: '🎉 Nieuwe prestatie!',
    message: 'Je hebt een nieuwe badge verdiend! Bekijk je profiel.',
    type: 'success',
    priority: 'high',
    trigger: 'immediate'
  },
  
  MEETUP_REMINDER: {
    id: 'meetup_reminder',
    title: '⏰ Herinnering: Koffie meetup',
    message: 'Je hebt over 1 uur een meetup. Vergeet niet!',
    type: 'reminder',
    priority: 'high',
    trigger: 'scheduled'
  },
  
  WEEKLY_SUMMARY: {
    id: 'weekly_summary',
    title: '📊 Je week in koffie',
    message: 'Bekijk je activiteiten van deze week en plan nieuwe meetups!',
    type: 'info',
    priority: 'medium',
    trigger: 'scheduled'
  },
  
  FRIEND_ACTIVITY: {
    id: 'friend_activity',
    title: '👥 Je vrienden zijn actief',
    message: '3 van je vrienden hebben nieuwe meetups gemaakt!',
    type: 'info',
    priority: 'medium',
    trigger: 'conditional'
  },
  
  NEW_CAFE_NEARBY: {
    id: 'new_cafe_nearby',
    title: '🏪 Nieuwe cafe in de buurt',
    message: 'Er is een nieuwe cafe geopend bij jou in de buurt!',
    type: 'info',
    priority: 'low',
    trigger: 'conditional'
  },
  
  BIRTHDAY_WISH: {
    id: 'birthday_wish',
    title: '🎂 Happy Birthday!',
    message: 'Gefeliciteerd! Vier je verjaardag met een speciale koffie meetup!',
    type: 'success',
    priority: 'high',
    trigger: 'conditional',
    conditions: { isBirthday: true }
  }
}

export function shouldSendNotification(
  template: NotificationTemplate,
  userData: {
    lastActiveDate: Date
    streakDays: number
    totalMeetups: number
    isBirthday?: boolean
    location?: { latitude: number; longitude: number }
  }
): boolean {
  if (template.trigger === 'immediate') return true
  
  if (template.trigger === 'conditional') {
    switch (template.id) {
      case 'welcome_back':
        const daysSinceActive = Math.floor(
          (Date.now() - userData.lastActiveDate.getTime()) / (1000 * 60 * 60 * 24)
        )
        return daysSinceActive >= (template.conditions?.daysInactive || 7)
      
      case 'streak_reminder':
        return userData.streakDays >= (template.conditions?.streakDays || 3)
      
      case 'birthday_wish':
        return userData.isBirthday || false
      
      default:
        return true
    }
  }
  
  return false
}

export function getPersonalizedMessage(
  template: NotificationTemplate,
  userData: {
    name: string
    totalMeetups: number
    favoriteCafe?: string
  }
): string {
  let message = template.message
  
  // Personalize message
  message = message.replace('{name}', userData.name)
  message = message.replace('{totalMeetups}', userData.totalMeetups.toString())
  message = message.replace('{favoriteCafe}', userData.favoriteCafe || 'je favoriete cafe')
  
  return message
} 