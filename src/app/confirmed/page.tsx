"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Coffee, MapPin, Clock, Star, Calendar, CheckCircle, Mail, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function ConfirmedPage() {
  const handleAddToCalendar = (type: 'google' | 'outlook' | 'apple') => {
    // This would be populated with actual meetup data
    const event = {
      title: 'Coffee Meetup',
      description: 'Meeting for coffee and conversation',
      location: 'Coffee Shop Name',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours later
    }

    let url = ''
    switch (type) {
      case 'google':
        url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}&dates=${event.startDate.replace(/[-:]/g, '').split('.')[0]}Z/${event.endDate.replace(/[-:]/g, '').split('.')[0]}Z`
        break
      case 'outlook':
        url = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(event.title)}&body=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}&startdt=${event.startDate}&enddt=${event.endDate}`
        break
      case 'apple':
        url = `data:text/calendar;charset=utf8,BEGIN:VCALENDAR%0D%0AVERSION:2.0%0D%0ABEGIN:VEVENT%0D%0AURL:${encodeURIComponent(window.location.href)}%0D%0ADTSTART:${event.startDate.replace(/[-:]/g, '').split('.')[0]}Z%0D%0ADTEND:${event.endDate.replace(/[-:]/g, '').split('.')[0]}Z%0D%0ASUMMARY:${encodeURIComponent(event.title)}%0D%0ADESCRIPTION:${encodeURIComponent(event.description)}%0D%0ALOCATION:${encodeURIComponent(event.location)}%0D%0AEND:VEVENT%0D%0AEND:VCALENDAR`
        break
    }
    
    if (type === 'apple') {
      const link = document.createElement('a')
      link.href = url
      link.download = 'meetup.ics'
      link.click()
    } else {
      window.open(url, '_blank')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Meetup Confirmed!</h1>
          <p className="text-gray-600">
            Great! Your coffee meetup has been confirmed. Check your email for details.
          </p>
        </div>

        {/* Success Card */}
        <Card className="shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-green-600" />
              What&apos;s Next?
            </CardTitle>
            <CardDescription>
              We&apos;ve sent confirmation emails to both participants with all the details.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">✅ Meetup Details Sent</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Confirmation email sent to both participants</li>
                <li>• Calendar invites included</li>
                <li>• Coffee shop details and directions</li>
                <li>• Reminder email will be sent 24 hours before</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Add to Calendar */}
        <Card className="shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Add to Calendar
            </CardTitle>
            <CardDescription>
              Add this meetup to your calendar to never miss it
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button
                onClick={() => handleAddToCalendar('google')}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Google Calendar
              </Button>
              <Button
                onClick={() => handleAddToCalendar('outlook')}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Outlook
              </Button>
              <Button
                onClick={() => handleAddToCalendar('apple')}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Apple Calendar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button asChild className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3">
            <Link href="/create">
              Create Another Meetup
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="w-full py-3">
            <Link href="/">
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Tips */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">💡 Pro Tips</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Arrive 5 minutes early to secure a good spot</li>
            <li>• Have your phone charged for easy communication</li>
            <li>• Consider bringing a book or laptop as conversation starters</li>
            <li>• Don&apos;t forget to enjoy the coffee and conversation!</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 