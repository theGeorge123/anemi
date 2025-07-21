export interface UserStats {
  totalMeetups: number
  totalInvites: number
  totalAccepted: number
  totalDeclined: number
  streakDays: number
  lastActiveDate: Date
  favoriteCafes: number
  reviewsPosted: number
  level: number
  experiencePoints: number
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt: Date | undefined
  progress: number
  maxProgress: number
}

export const ACHIEVEMENTS = {
  FIRST_MEETUP: {
    id: 'first_meetup',
    title: 'Eerste Koffie! ☕',
    description: 'Je hebt je eerste meetup gemaakt',
    icon: '☕',
    maxProgress: 1
  },
  SOCIAL_BUTTERFLY: {
    id: 'social_butterfly',
    title: 'Sociale Vlinder 🦋',
    description: '10 meetups georganiseerd',
    icon: '🦋',
    maxProgress: 10
  },
  COFFEE_EXPERT: {
    id: 'coffee_expert',
    title: 'Koffie Expert 🧠',
    description: '25 verschillende cafes bezocht',
    icon: '🧠',
    maxProgress: 25
  },
  STREAK_MASTER: {
    id: 'streak_master',
    title: 'Streak Master 🔥',
    description: '7 dagen achter elkaar actief',
    icon: '🔥',
    maxProgress: 7
  },
  REVIEWER: {
    id: 'reviewer',
    title: 'Reviewer ⭐',
    description: '5 reviews gepost',
    icon: '⭐',
    maxProgress: 5
  }
}

export function calculateLevel(experiencePoints: number): number {
  return Math.floor(experiencePoints / 100) + 1
}

export function calculateExperienceForAction(action: string): number {
  const experienceMap = {
    'create_meetup': 50,
    'accept_invite': 30,
    'complete_meetup': 100,
    'post_review': 25,
    'favorite_cafe': 10,
    'daily_login': 5,
    'weekly_streak': 50
  }
  return experienceMap[action as keyof typeof experienceMap] || 0
}

export function getAchievementProgress(userStats: UserStats): Achievement[] {
  const achievements: Achievement[] = []
  
  // First meetup
  achievements.push({
    ...ACHIEVEMENTS.FIRST_MEETUP,
    progress: Math.min(userStats.totalMeetups, ACHIEVEMENTS.FIRST_MEETUP.maxProgress),
    unlockedAt: userStats.totalMeetups > 0 ? new Date() : undefined
  })
  
  // Social butterfly
  achievements.push({
    ...ACHIEVEMENTS.SOCIAL_BUTTERFLY,
    progress: Math.min(userStats.totalMeetups, ACHIEVEMENTS.SOCIAL_BUTTERFLY.maxProgress),
    unlockedAt: userStats.totalMeetups >= 10 ? new Date() : undefined
  })
  
  // Coffee expert
  achievements.push({
    ...ACHIEVEMENTS.COFFEE_EXPERT,
    progress: Math.min(userStats.favoriteCafes, ACHIEVEMENTS.COFFEE_EXPERT.maxProgress),
    unlockedAt: userStats.favoriteCafes >= 25 ? new Date() : undefined
  })
  
  // Streak master
  achievements.push({
    ...ACHIEVEMENTS.STREAK_MASTER,
    progress: Math.min(userStats.streakDays, ACHIEVEMENTS.STREAK_MASTER.maxProgress),
    unlockedAt: userStats.streakDays >= 7 ? new Date() : undefined
  })
  
  // Reviewer
  achievements.push({
    ...ACHIEVEMENTS.REVIEWER,
    progress: Math.min(userStats.reviewsPosted, ACHIEVEMENTS.REVIEWER.maxProgress),
    unlockedAt: userStats.reviewsPosted >= 5 ? new Date() : undefined
  })
  
  return achievements
} 