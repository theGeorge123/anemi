"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { StepIndicator } from '@/components/meetups/StepIndicator'
import { StepContent } from '@/components/meetups/StepContent'
import { type FormData } from '@/components/meetups/formValidation'
import { type City } from '@/constants/cities'
import { getOrSetCsrfToken } from '@/lib/csrf'
import { useAsyncOperation } from '@/lib/use-async-operation'
import { ErrorService } from '@/lib/error-service'
import { MeetupWizard } from '@/components/meetups/MeetupWizard'
import { withAuth } from '@/components/withAuth'

const CreateMeetupPage = withAuth(() => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">☕ Create a Meetup</h1>
          <p className="text-muted-foreground">Let&apos;s find you the perfect coffee spot!</p>
        </div>
        <MeetupWizard />
      </div>
    </div>
  )
})

export default CreateMeetupPage 