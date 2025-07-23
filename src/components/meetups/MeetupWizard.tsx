"use client"

import React, { useState, useEffect } from 'react';
import { StepContent } from './StepContent';
import { StepIndicator } from './StepIndicator';
import { InviteModal } from './InviteModal';
import { type City } from '@/constants/cities';
import { Card, CardContent } from '@/components/ui/card';
import { useSupabase } from '@/components/SupabaseProvider';
import { type FormData } from './formValidation';
import { PriceRange } from '@prisma/client';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export interface MeetupFormData {
  name: string;
  email: string;
  city: City;
  dates: string[];
  times: string[];
  dateTimePreferences: Record<string, string[]>;
  priceRange: PriceRange;
  viewType?: 'map' | 'list';
  cafeId?: string;
}

const initialFormData: MeetupFormData = {
  name: '',
  email: '', // Will be filled from user session
  city: 'Amsterdam',
  dates: [],
  times: [],
  dateTimePreferences: {},
  priceRange: PriceRange.MODERATE,
};

function MeetupWizardContent() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<MeetupFormData>(initialFormData);
  const [inviteCode, setInviteCode] = useState<string>('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const { session } = useSupabase();

  // Initialize email from user session
  useEffect(() => {
    if (session?.user?.email && !formData.email) {
      setFormData(prev => ({ ...prev, email: session.user.email || '' }));
    }
  }, [session, formData.email]);

  const handleNext = () => setCurrentStep((prev) => prev + 1);
  const handleBack = () => setCurrentStep((prev) => prev - 1);
  const updateFormData = (data: Partial<MeetupFormData>) =>
    setFormData((prev) => ({ ...prev, ...data }));

  const handleFinish = async () => {
    try {
      // Check if user is logged in
      if (!session?.user?.email) {
        console.error('User not logged in');
        // Redirect to login with return URL
        if (typeof window !== 'undefined') {
          window.location.href = `/auth/signin?redirect=${encodeURIComponent('/create')}`;
        }
        return;
      }

      // Generate invite code
      const response = await fetch('/api/generate-invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organizerName: formData.name,
          organizerEmail: formData.email,
          city: formData.city,
          dates: formData.dates,
          times: formData.times,
          dateTimePreferences: formData.dateTimePreferences,
          priceRange: formData.priceRange,
          viewType: formData.viewType,
          cafeId: formData.cafeId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate invite');
      }

      const data = await response.json();
      
      // Show invite code modal instead of redirecting
      setInviteCode(data.invite.token);
      setShowInviteModal(true);
    } catch (error) {
      console.error('Error generating invite:', error);
      // Handle error - could show a toast or error message
    }
  };

  // Total steps will be calculated dynamically in StepContent
  const [totalSteps, setTotalSteps] = useState(5);

  return (
    <div className="meetup-wizard">
      <Card className="shadow-lg animate-bounceIn">
        <CardContent className="p-8">
          <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
          <StepContent
            currentStep={currentStep}
            formData={formData as FormData}
            onFormDataChange={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
            onFinish={handleFinish}
            onTotalStepsChange={setTotalSteps}
          />
        </CardContent>
      </Card>
      
      <InviteModal
        inviteCode={inviteCode}
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
      />
    </div>
  );
}

export function MeetupWizard() {
  return (
    <ErrorBoundary>
      <MeetupWizardContent />
    </ErrorBoundary>
  );
} 