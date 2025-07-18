import React, { useState, useEffect } from 'react';
import { StepContent } from './StepContent';
import { StepIndicator } from './StepIndicator';
import { type City } from '@/constants/cities';
import { Card, CardContent } from '@/components/ui/card';
import { useSupabase } from '@/components/SupabaseProvider';
import { type FormData } from './formValidation';
import { PriceRange } from '@prisma/client';

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

export function MeetupWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<MeetupFormData>(initialFormData);
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
        throw new Error('Failed to generate invite');
      }

      const data = await response.json();
      
      // Redirect to invite page with the generated code
      window.location.href = `/invite/${data.invite.token}`;
    } catch (error) {
      console.error('Error generating invite:', error);
      // Handle error - could show a toast or error message
    }
  };

  return (
    <div className="meetup-wizard">
      <Card className="shadow-lg animate-bounceIn">
        <CardContent className="p-8">
          <StepIndicator currentStep={currentStep} totalSteps={7} />
          <StepContent
            currentStep={currentStep}
            formData={formData as FormData}
            onFormDataChange={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
            onFinish={handleFinish}
          />
        </CardContent>
      </Card>
    </div>
  );
} 