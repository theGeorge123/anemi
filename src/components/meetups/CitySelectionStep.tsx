import React from 'react';
import { CitySelector } from './CitySelector';
import { Button } from '@/components/ui/button';
import { type City } from '@/constants/cities';

export interface CitySelectionStepProps {
  city: City;
  onNext: (city: City) => void;
  onBack: () => void;
}

export function CitySelectionStep({ city, onNext, onBack }: CitySelectionStepProps) {
  const [selectedCity, setSelectedCity] = React.useState<City>(city);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(selectedCity);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">🌍 Where do you want to meet?</h3>
        <p className="text-gray-600">Choose your preferred city for the meetup</p>
      </div>
      <CitySelector selectedCity={selectedCity} onChange={setSelectedCity} />
      <div className="flex justify-between pt-6">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white">
          Next
        </Button>
      </div>
    </form>
  );
} 