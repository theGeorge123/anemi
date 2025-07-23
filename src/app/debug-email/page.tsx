"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
const EMAIL_TYPES = [
  { value: 'cancellation', label: '📧 Meetup Cancellation', description: 'Email sent when meetup is deleted' },
  { value: 'confirmation', label: '✅ Meetup Confirmation (New)', description: 'Email sent when meetup is accepted' },
  { value: 'confirmation-old', label: '✅ Meetup Confirmation (Old)', description: 'Legacy confirmation email' },
  { value: 'welcome', label: '👋 Welcome Email', description: 'Email sent to new users' },
  { value: 'invite', label: '📨 Invite Email', description: 'Email sent with meetup invitation' },
  { value: 'calendar', label: '📅 Calendar Invite', description: 'Email with calendar attachment' },
  { value: 'reminder', label: '⏰ Meetup Reminder', description: 'Email reminder before meetup' }
]

export default function DebugEmailPage() {
  const [email, setEmail] = useState('')
  const [testType, setTestType] = useState('cancellation')
  const [meetupTitle, setMeetupTitle] = useState('Test Coffee Meetup')
  const [meetupDate, setMeetupDate] = useState('2025-01-15')
  const [reason, setReason] = useState('Test cancellation')
  const [organizerName, setOrganizerName] = useState('John Doe')
  const [inviteeName, setInviteeName] = useState('Jane Smith')
  const [cafeName, setCafeName] = useState('Test Cafe')
  const [cafeAddress, setCafeAddress] = useState('Test Address 123')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const testEmail = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/debug-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testType,
          to: email,
          meetupTitle,
          meetupDate,
          reason,
          organizerName,
          inviteeName,
          cafeName,
          cafeAddress,
          availableDates: ['2025-01-15', '2025-01-16'],
          availableTimes: ['09:00', '10:00'],
          chosenDate: '2025-01-15',
          chosenTime: '09:00'
        }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: 'Failed to test email', details: error })
    } finally {
      setIsLoading(false)
    }
  }

  const selectedEmailType = EMAIL_TYPES.find(type => type.value === testType)

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">🧪 Email Debug Tool</CardTitle>
            <p className="text-center text-gray-600">
              Test alle email functies om te controleren of ze werken
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@example.com"
              />
            </div>

            <div>
              <Label htmlFor="testType">Email Type</Label>
              <select
                id="testType"
                value={testType}
                onChange={(e) => setTestType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                {EMAIL_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label} - {type.description}
                  </option>
                ))}
              </select>
            </div>

            {selectedEmailType && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Testing:</strong> {selectedEmailType.description}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="meetupTitle">Meetup Title</Label>
                <Input
                  id="meetupTitle"
                  value={meetupTitle}
                  onChange={(e) => setMeetupTitle(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="meetupDate">Meetup Date</Label>
                <Input
                  id="meetupDate"
                  value={meetupDate}
                  onChange={(e) => setMeetupDate(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="organizerName">Organizer Name</Label>
                <Input
                  id="organizerName"
                  value={organizerName}
                  onChange={(e) => setOrganizerName(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="inviteeName">Invitee Name</Label>
                <Input
                  id="inviteeName"
                  value={inviteeName}
                  onChange={(e) => setInviteeName(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="cafeName">Cafe Name</Label>
                <Input
                  id="cafeName"
                  value={cafeName}
                  onChange={(e) => setCafeName(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="cafeAddress">Cafe Address</Label>
                <Input
                  id="cafeAddress"
                  value={cafeAddress}
                  onChange={(e) => setCafeAddress(e.target.value)}
                />
              </div>
            </div>

            {testType === 'cancellation' && (
              <div>
                <Label htmlFor="reason">Cancellation Reason</Label>
                <Input
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
            )}

            <Button
              onClick={testEmail}
              disabled={isLoading || !email}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
            >
              {isLoading ? 'Testing...' : `Test ${selectedEmailType?.label || 'Email'}`}
            </Button>

            {result && (
              <div className={`p-4 rounded-lg ${
                result.success 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                <h3 className="font-semibold mb-2">
                  {result.success ? '✅ Success' : '❌ Error'}
                </h3>
                <div className="text-sm mb-2">
                  <strong>Test Type:</strong> {result.testType || 'unknown'}
                </div>
                <pre className="text-sm whitespace-pre-wrap bg-white p-2 rounded border">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">📋 Email Types Overzicht:</h4>
              <div className="space-y-2 text-sm">
                {EMAIL_TYPES.map((type) => (
                  <div key={type.value} className="flex items-center gap-2">
                    <span className="text-gray-500">•</span>
                    <span className="font-medium">{type.label}</span>
                    <span className="text-gray-600">-</span>
                    <span className="text-gray-600">{type.description}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 