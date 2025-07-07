import { useState } from 'react';
import { ContactInfoStep } from './ContactInfoStep';
import { type City } from '@/constants/cities';
import { Card, CardContent } from '@/components/ui/card';

export interface MeetupFormData {
  name: string;
  email: string;
  city: City;
  dates: string[];
  times: string[];
  dateTimePreferences: Record<string, string[]>;
  priceRange: string;
}

const initialFormData: MeetupFormData = {
  name: '',
  email: '',
  city: 'Amsterdam',
  dates: [],
  times: [],
  dateTimePreferences: {},
  priceRange: 'MODERATE',
};

export function MeetupWizard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<MeetupFormData>(initialFormData);

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);
  const updateFormData = (data: Partial<MeetupFormData>) =>
    setFormData((prev) => ({ ...prev, ...data }));

  return (
    <div className="meetup-wizard">
      <Card className="shadow-lg animate-bounceIn">
        <CardContent className="p-8">
          {step === 1 && (
            <ContactInfoStep
              name={formData.name}
              email={formData.email}
              onNext={({ name, email }) => {
                updateFormData({ name, email });
                handleNext();
              }}
            />
          )}
          {/* Future: Add other steps here */}
        </CardContent>
      </Card>
    </div>
  );
} 