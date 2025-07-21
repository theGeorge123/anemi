export interface UserPreferences {
  preferredCities: string[]
  preferredPriceRange: string[]
  preferredTimes: string[]
  preferredDays: string[]
  maxTravelDistance: number
  favoriteCafeTypes: string[]
  interests: string[]
}

export interface CafeRecommendation {
  cafeId: string
  name: string
  score: number
  reasons: string[]
  distance: number
  matchPercentage: number
}

export interface MeetupRecommendation {
  meetupId: string
  title: string
  score: number
  reasons: string[]
  organizerName: string
  cafeName: string
  date: string
  time: string
}

export function calculateCafeScore(
  cafe: any,
  userPreferences: UserPreferences,
  userLocation: { latitude: number; longitude: number }
): CafeRecommendation {
  let score = 0
  const reasons: string[] = []
  
  // Distance factor (closer = higher score)
  const distance = calculateDistance(
    userLocation.latitude,
    userLocation.longitude,
    cafe.latitude,
    cafe.longitude
  )
  
  if (distance <= userPreferences.maxTravelDistance) {
    score += 50
    reasons.push('Dichtbij je locatie')
  }
  
  // Price range match
  if (userPreferences.preferredPriceRange.includes(cafe.priceRange)) {
    score += 30
    reasons.push('Past bij je budget')
  }
  
  // Rating factor
  if (cafe.rating >= 4.0) {
    score += 20
    reasons.push('Hoge rating')
  }
  
  // Features match
  const matchingFeatures = cafe.features.filter((feature: string) =>
    userPreferences.favoriteCafeTypes.includes(feature)
  )
  
  if (matchingFeatures.length > 0) {
    score += matchingFeatures.length * 10
    reasons.push(`${matchingFeatures.length} gewenste features`)
  }
  
  // Popularity factor
  if (cafe.reviewCount > 10) {
    score += 10
    reasons.push('Populair bij anderen')
  }
  
  const matchPercentage = Math.min(score, 100)
  
  return {
    cafeId: cafe.id,
    name: cafe.name,
    score,
    reasons,
    distance,
    matchPercentage
  }
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function getPersonalizedGreeting(
  userData: {
    name: string
    totalMeetups: number
    lastActiveDate: Date
    favoriteCafe?: string
  }
): string {
  const now = new Date()
  const hours = now.getHours()
  const daysSinceActive = Math.floor(
    (now.getTime() - userData.lastActiveDate.getTime()) / (1000 * 60 * 60 * 24)
  )
  
  let greeting = ''
  
  if (hours < 12) {
    greeting = 'Goedemorgen'
  } else if (hours < 18) {
    greeting = 'Goedemiddag'
  } else {
    greeting = 'Goedenavond'
  }
  
  if (daysSinceActive === 0) {
    greeting += ` ${userData.name}! Welkom terug! ☕`
  } else if (daysSinceActive === 1) {
    greeting += ` ${userData.name}! We hebben je gisteren gemist.`
  } else if (daysSinceActive > 7) {
    greeting += ` ${userData.name}! We hebben je gemist! Tijd voor koffie?`
  } else {
    greeting += ` ${userData.name}! Klaar voor een nieuwe koffie meetup?`
  }
  
  return greeting
}

export function getMotivationalMessage(
  userStats: {
    totalMeetups: number
    streakDays: number
    level: number
    lastAchievement: string | undefined
  }
): string {
  const messages = [
    'Elke koffie is een nieuwe kans om iemand te ontmoeten! ☕',
    'Je bent al level ' + userStats.level + '! Blijf groeien! 🌱',
    'Je streak van ' + userStats.streakDays + ' dagen is indrukwekkend! 🔥',
    'Al ' + userStats.totalMeetups + ' meetups georganiseerd! Je bent een pro! 🎉',
    'Nieuwe mensen ontmoeten is altijd een goed idee! 💫'
  ]
  
  if (userStats.lastAchievement && userStats.lastAchievement.length > 0) {
    messages.push(`Je hebt net "${userStats.lastAchievement}" verdiend! 🏆`)
  }
  
  return messages[Math.floor(Math.random() * messages.length)] || 'Elke koffie is een nieuwe kans om iemand te ontmoeten! ☕'
} 