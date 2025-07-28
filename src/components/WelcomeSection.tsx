"use client"

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, Shuffle } from 'lucide-react';
import { useState, useEffect } from 'react';

// List of fun random nicknames in Dutch
const randomNicknames = [
  'Koffiekoning', 'Espressoelf', 'Cappuccinocreatief', 'Lattelover', 'Mochamagie',
  'Frappefan', 'Baristabuddy', 'Cafékampioen', 'Bruinegoudzoeker', 'Koffieklant',
  'Espressoenthusiast', 'Melkschuimmeester', 'Bonenzoekers', 'Koffiecurator', 'Cafeïnekenner',
  'Aroma-artiest', 'Filterfanaat', 'Koffieavonturier', 'Espressoexpert', 'Latte-kunstenaar',
  'Mokameesters', 'Cappuccinochef', 'Baristaprins', 'Koffieconnoiseur', 'Cafécreatief',
  'Espressoengelije', 'Melkschuimmagier', 'Bonenbaron', 'Koffiekoning', 'Aromadirecteur',
  'Filterfee', 'Lattelieveling', 'Mokaminnaar', 'Cappuccinocommandant', 'Baristaboss',
  'Koffiekeizer', 'Espressoenergie', 'Melkschuimmaakt', 'Bonenbewaker', 'Aromaalchemist'
];

function getRandomNickname(): string {
  const randomIndex = Math.floor(Math.random() * randomNicknames.length);
  return randomNicknames[randomIndex] || 'Koffieliefhebber';
}

interface WelcomeSectionProps {
  isLoggedIn?: boolean;
}

export function WelcomeSection({ isLoggedIn = false }: WelcomeSectionProps) {
  const [nickname, setNickname] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [editNickname, setEditNickname] = useState('');

  // Load or generate nickname when component mounts
  useEffect(() => {
    if (!isLoggedIn) {
      const savedNickname = localStorage.getItem('guestNickname');
      if (savedNickname) {
        setNickname(savedNickname);
        setEditNickname(savedNickname);
      } else {
        const randomName = getRandomNickname();
        setNickname(randomName);
        setEditNickname(randomName);
        localStorage.setItem('guestNickname', randomName);
      }
    }
  }, [isLoggedIn]);

  const generateNewNickname = () => {
    const newNickname = getRandomNickname();
    setNickname(newNickname);
    setEditNickname(newNickname);
    localStorage.setItem('guestNickname', newNickname);
  };

  const saveNickname = () => {
    if (editNickname.trim()) {
      const trimmedNickname = editNickname.trim();
      setNickname(trimmedNickname);
      localStorage.setItem('guestNickname', trimmedNickname);
      setIsEditing(false);
    }
  };

  const cancelEdit = () => {
    setEditNickname(nickname);
    setIsEditing(false);
  };

  // Don't show for logged-in users
  if (isLoggedIn) {
    return null;
  }

  return (
    <div className="mb-8 sm:mb-12">
      {/* Welcome message with nickname */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-3xl p-6 sm:p-8 shadow-lg mx-2 sm:mx-0">
        <div className="text-center">
          <div className="flex justify-center items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full flex items-center justify-center shadow-md">
              <span className="text-green-600 text-2xl">☕</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-display font-bold text-green-800">
              Welkom
            </h3>
          </div>
          
          {nickname ? (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
              <p className="text-green-700 text-lg sm:text-xl font-medium">
                {nickname}!
              </p>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="h-10 w-10 p-0 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-full transition-all duration-200"
                  title="Bijnaam bewerken"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={generateNewNickname}
                  className="h-10 w-10 p-0 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-full transition-all duration-200"
                  title="Nieuwe random bijnaam"
                >
                  <Shuffle className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="mb-4">
              <Button
                onClick={generateNewNickname}
                variant="outline"
                className="border-green-300 text-green-700 hover:bg-green-50"
              >
                <Shuffle className="w-4 h-4 mr-2" />
                Genereer een bijnaam
              </Button>
            </div>
          )}

          <p className="text-green-600 text-sm sm:text-base">
            Klaar om vrienden te ontmoeten over koffie?
          </p>

          {/* Edit nickname form */}
          {isEditing && (
            <div className="mt-6 p-4 sm:p-6 bg-white rounded-2xl border-2 border-green-200 shadow-md">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  value={editNickname}
                  onChange={(e) => setEditNickname(e.target.value)}
                  placeholder="Jouw bijnaam..."
                  className="flex-1"
                  maxLength={50}
                                     onKeyDown={(e) => {
                     if (e.key === 'Enter') {
                       e.preventDefault();
                       saveNickname();
                     }
                     if (e.key === 'Escape') {
                       e.preventDefault();
                       cancelEdit();
                     }
                   }}
                />
                <div className="flex gap-3 justify-center sm:justify-start">
                  <Button
                    size="lg"
                    onClick={saveNickname}
                    className="bg-green-600 hover:bg-green-700 shadow-md"
                  >
                    Opslaan
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={cancelEdit}
                    className="border-green-300 text-green-700 hover:bg-green-50"
                  >
                    Annuleren
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}