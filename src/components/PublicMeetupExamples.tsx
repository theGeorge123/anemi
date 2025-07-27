"use client"

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Calendar, Clock, Users, Coffee, Plus, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface ExampleMeetup {
  id: string
  title: string
  cafe: {
    name: string
    address: string
    city: string
  }
  date: string
  time: string
  participants: number
  maxParticipants: number
  status: string
  category: string
}

// Mock data for example meetups
const exampleMeetups: ExampleMeetup[] = [
  {
    id: '1',
    title: 'Weekend Koffie & Gesprek',
    cafe: {
      name: 'Café Central',
      address: 'Leidseplein 12',
      city: 'Amsterdam'
    },
    date: '2024-01-15',
    time: '14:30',
    participants: 3,
    maxParticipants: 4,
    status: 'confirmed',
    category: 'SOCIAL'
  },
  {
    id: '2',
    title: 'Netwerken over Cappuccino',
    cafe: {
      name: 'The Coffee Bar',
      address: 'Witte de Withstraat 45',
      city: 'Rotterdam'
    },
    date: '2024-01-16',
    time: '10:00',
    participants: 2,
    maxParticipants: 6,
    status: 'confirmed',
    category: 'NETWORKING'
  },
  {
    id: '3',
    title: 'Boekclub Bijeenkomst',
    cafe: {
      name: 'Library Café',
      address: 'Oudegracht 234',
      city: 'Utrecht'
    },
    date: '2024-01-17',
    time: '19:00',
    participants: 4,
    maxParticipants: 8,
    status: 'confirmed',
    category: 'BOOK_CLUB'
  }
]

export function PublicMeetupExamples() {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    })
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'SOCIAL':
        return 'Sociaal'
      case 'NETWORKING':
        return 'Netwerken'
      case 'BOOK_CLUB':
        return 'Boekclub'
      case 'STUDY_GROUP':
        return 'Studiegroep'
      case 'TECH_MEETUP':
        return 'Tech'
      default:
        return category
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'SOCIAL':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'NETWORKING':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'BOOK_CLUB':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'STUDY_GROUP':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'TECH_MEETUP':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl border-2 border-orange-200 p-8 shadow-lg">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-orange-300 to-amber-300 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
          <Coffee className="w-10 h-10 text-orange-700" />
        </div>
        <h3 className="text-3xl font-display font-bold text-gray-900 mb-4">
          Ontdek Koffie Meetups
        </h3>
        <p className="text-lg text-gray-600 mb-2 leading-relaxed max-w-2xl mx-auto">
          Bekijk voorbeelden van recente meetups en krijg inspiratie voor je eigen koffie avonturen
        </p>
        <p className="text-orange-700 font-medium">
          Geen login vereist om te verkennen! ☕
        </p>
      </div>

      {/* Example Meetups Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {exampleMeetups.map((meetup) => (
          <Card key={meetup.id} className="bg-white/90 backdrop-blur-sm border-amber-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className={getCategoryColor(meetup.category)}>
                    {getCategoryLabel(meetup.category)}
                  </Badge>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    ✅ Bevestigd
                  </Badge>
                </div>

                <h4 className="font-semibold text-gray-900 text-lg leading-tight">
                  {meetup.title}
                </h4>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Coffee className="w-4 h-4 text-amber-600" />
                    <span className="font-medium">{meetup.cafe.name}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{meetup.cafe.address}, {meetup.cafe.city}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(meetup.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{meetup.time}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{meetup.participants}/{meetup.maxParticipants} deelnemers</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center space-y-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-amber-200 max-w-2xl mx-auto">
          <h4 className="text-xl font-semibold text-gray-900 mb-3">
            Klaar voor je eigen koffie avontuur? ☕
          </h4>
          <p className="text-gray-600 mb-6">
            Maak je eerste meetup in minder dan 2 minuten. Kies een café, stel datums voor en nodig vrienden uit!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <Link href="/create">
                <Plus className="w-5 h-5 mr-2" />
                Start je Meetup
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="border-2 border-orange-300 text-orange-700 hover:bg-orange-50 hover:border-orange-400 transition-all duration-300">
              <Link href="/auth/signup">
                <ArrowRight className="w-5 h-5 mr-2" />
                Word lid gratis
              </Link>
            </Button>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          💡 Al lid? <Link href="/auth/signin" className="text-orange-600 hover:text-orange-700 font-medium">Log hier in</Link> om je dashboard te bekijken
        </p>
      </div>
    </div>
  )
}