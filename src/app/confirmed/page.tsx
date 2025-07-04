"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Coffee, MapPin, Clock, Star, CheckCircle, Mail, Copy, Share2 } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'

function ConfirmedContent() {
  const searchParams = useSearchParams()
  const [copied, setCopied] = useState(false)
  const inviteLink = searchParams.get('inviteLink')

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

        {/* Invite Link Card */}
        {inviteLink && (
          <Card className="shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-blue-600" />
                Share Your Invite
              </CardTitle>
              <CardDescription>
                Send this link to your friend so they can choose their preferred date and time
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    📱 Share via WhatsApp, Email, or any app
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inviteLink}
                    readOnly
                    className="flex-1 p-2 border border-gray-300 rounded text-sm bg-white"
                  />
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(inviteLink)
                      setCopied(true)
                      setTimeout(() => setCopied(false), 2000)
                    }}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Your friend will be able to choose their preferred date and time from your available options
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Success Card */}
        <Card className="shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-green-600" />
              What&apos;s Next?
            </CardTitle>
            <CardDescription>
              Share the invite link with your friend and wait for their confirmation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">✅ Invite Created Successfully</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Your friend will receive the invite link</li>
                <li>• They can choose their preferred date and time</li>
                <li>• You&apos;ll both get confirmation emails once they confirm</li>
                <li>• Calendar invites will be included in the final confirmation</li>
              </ul>
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

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-green-200 rounded-full mx-auto mb-4"></div>
          <div className="h-8 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-8"></div>
        </div>
      </div>
    </div>
  )
}

export default function ConfirmedPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ConfirmedContent />
    </Suspense>
  )
} 