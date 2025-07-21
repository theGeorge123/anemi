"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Trophy, Coffee, Users, Calendar, TrendingUp, Flame } from 'lucide-react'
import { type UserStats, type Achievement, getAchievementProgress } from '@/lib/engagement'
import { getPersonalizedGreeting, getMotivationalMessage } from '@/lib/recommendations'

interface UserStatsProps {
  userStats: UserStats
  achievements: Achievement[]
}

export function UserStats({ userStats, achievements }: UserStatsProps) {
  const [greeting, setGreeting] = useState('')
  const [motivationalMessage, setMotivationalMessage] = useState('')

  useEffect(() => {
    setGreeting(getPersonalizedGreeting({
      name: 'Gebruiker', // Replace with actual user name
      totalMeetups: userStats.totalMeetups,
      lastActiveDate: userStats.lastActiveDate
    }))

    setMotivationalMessage(getMotivationalMessage({
      totalMeetups: userStats.totalMeetups,
      streakDays: userStats.streakDays,
      level: userStats.level,
      lastAchievement: undefined
    }))
  }, [userStats])

  const unlockedAchievements = achievements.filter(a => a.unlockedAt)
  const progressAchievements = achievements.filter(a => !a.unlockedAt && a.progress > 0)

  return (
    <div className="space-y-6">
      {/* Personalized Greeting */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <CardContent className="p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{greeting}</h2>
            <p className="text-gray-600">{motivationalMessage}</p>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Coffee className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{userStats.totalMeetups}</div>
            <div className="text-sm text-gray-600">Meetups</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Flame className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{userStats.streakDays}</div>
            <div className="text-sm text-gray-600">Streak dagen</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{userStats.level}</div>
            <div className="text-sm text-gray-600">Level</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{userStats.experiencePoints}</div>
            <div className="text-sm text-gray-600">XP</div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Prestaties & Badges
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Unlocked Achievements */}
          {unlockedAchievements.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">🏆 Verdiende Badges</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {unlockedAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <span className="text-2xl">{achievement.icon}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-green-800">{achievement.title}</div>
                      <div className="text-sm text-green-600">{achievement.description}</div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Verdiend
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progress Achievements */}
          {progressAchievements.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">🎯 In Progress</h3>
              <div className="space-y-3">
                {progressAchievements.map((achievement) => (
                  <div key={achievement.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{achievement.icon}</span>
                        <span className="font-medium">{achievement.title}</span>
                      </div>
                      <span className="text-sm text-gray-600">
                        {achievement.progress}/{achievement.maxProgress}
                      </span>
                    </div>
                    <Progress
                      value={(achievement.progress / achievement.maxProgress) * 100}
                      className="h-2"
                    />
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {achievements.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Trophy className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Nog geen prestaties verdiend. Maak je eerste meetup om te beginnen!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>⚡ Snelle Acties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-center transition-colors">
              <Coffee className="w-6 h-6 mx-auto mb-2" />
              <div className="font-semibold">Nieuwe Meetup</div>
              <div className="text-sm opacity-90">Organiseer een koffie</div>
            </button>
            
            <button className="p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-center transition-colors">
              <Users className="w-6 h-6 mx-auto mb-2" />
              <div className="font-semibold">Vind Meetups</div>
              <div className="text-sm opacity-90">Sluit je aan</div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 