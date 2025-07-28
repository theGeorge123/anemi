"use client"

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, LogIn, Calendar, LogOut, Eye, Edit, Shuffle } from 'lucide-react';
import Link from 'next/link';
import { useSupabase } from '@/components/SupabaseProvider';
import { useState, useEffect } from 'react';
import { useToaster } from '@/components/ui/toaster';



interface UserNickname {
  nickname: string | null;
  email: string | null;
}

export function LoginStatus() {
  const { session, loading, supabase } = useSupabase();
  const [userNickname, setUserNickname] = useState<UserNickname | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editNickname, setEditNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToaster();

  // Fetch user nickname when session is available
  useEffect(() => {
    if (session?.user) {
      fetchUserNickname();
    }
  }, [session]);

  // Auto-generate nickname if user doesn't have one
  useEffect(() => {
    if (userNickname && !userNickname.nickname && session?.user) {
      // Automatically generate a fun nickname for new users
      const generateInitialNickname = async () => {
        try {
          const response = await fetch('/api/user/nickname', {
            method: 'PUT'
          });
          if (response.ok) {
            const data = await response.json();
            setUserNickname(prev => ({ ...prev!, nickname: data.nickname }));
          }
        } catch (error) {
          console.error('Error auto-generating nickname:', error);
        }
      };
      generateInitialNickname();
    }
  }, [userNickname, session]);

  const fetchUserNickname = async () => {
    try {
      const response = await fetch('/api/user/nickname');
      if (response.ok) {
        const data = await response.json();
        setUserNickname(data);
        setEditNickname(data.nickname || '');
      }
    } catch (error) {
      console.error('Error fetching nickname:', error);
    }
  };

  const generateRandomNickname = async () => {
    try {
      const response = await fetch('/api/user/nickname', {
        method: 'PUT'
      });
      if (response.ok) {
        const data = await response.json();
        setEditNickname(data.nickname);
      }
    } catch (error) {
      console.error('Error generating nickname:', error);
      // Fallback to manual generation
      setEditNickname('Koffieliefhebber');
    }
  };

  const saveNickname = async () => {
    if (!editNickname.trim()) {
      addToast({
        title: "Fout",
        description: "Bijnaam mag niet leeg zijn",
        type: "error"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/user/nickname', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nickname: editNickname.trim() })
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserNickname(prev => ({ ...prev!, nickname: data.nickname }));
        setIsEditing(false);
        addToast({
          title: "Bijnaam opgeslagen!",
          description: data.nickname,
          type: "success"
        });
      } else {
        const errorData = await response.json();
        addToast({
          title: "Fout",
          description: errorData.error || "Kon bijnaam niet opslaan",
          type: "error"
        });
      }
    } catch (error) {
      console.error('Error saving nickname:', error);
      addToast({
        title: "Fout",
        description: "Er ging iets mis",
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditNickname(userNickname?.nickname || '');
    setIsEditing(false);
  };

  // Show loading state - mobile friendly
  if (loading) {
    return (
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center items-center mb-8 sm:mb-12">
        <Button asChild size="lg" className="text-base sm:text-lg px-6 py-4 sm:px-10 sm:py-8 w-full sm:w-auto bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300 sm:transform sm:hover:scale-105">
          <Link href="/auth/signin?redirect=%2Fcreate">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
            Start een Meetup
          </Link>
        </Button>
        
        <Button asChild variant="outline" size="lg" className="text-base sm:text-lg px-6 py-4 sm:px-10 sm:py-8 w-full sm:w-auto border-2 border-amber-300 hover:bg-amber-50 hover:border-amber-400 transition-all duration-300">
          <Link href="/auth/signin">
            <LogIn className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
            Inloggen
          </Link>
        </Button>
        
        <Button asChild variant="outline" size="lg" className="text-base sm:text-lg px-6 py-4 sm:px-10 sm:py-8 w-full sm:w-auto border-2 border-amber-300 hover:bg-amber-50 hover:border-amber-400 transition-all duration-300">
          <Link href="/auth/signup">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
            Lid worden
          </Link>
        </Button>
      </div>
    );
  }

  // Logged in user - show welcome and appropriate buttons
  if (session) {
    return (
      <div className="space-y-8">
        {/* Welcome message with nickname - mobile friendly design */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-lg">
          <div className="text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                    <span className="text-amber-700 text-xl sm:text-2xl">☕</span>
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-display font-bold text-foreground">
                      Welkom terug!
                    </h3>
                                         {userNickname?.nickname ? (
                       <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 mt-1 sm:mt-2">
                         <p className="text-amber-600 text-lg sm:text-xl font-bold tracking-wide">
                           {userNickname.nickname} 😄
                         </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsEditing(true)}
                          className="h-8 w-8 sm:h-10 sm:w-10 p-0 text-amber-600 hover:text-amber-800 hover:bg-amber-100 rounded-full transition-all duration-200"
                          title="Bijnaam bewerken"
                        >
                          <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Button>
                      </div>
                    ) : (
                      <div className="mt-2 sm:mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            try {
                              const response = await fetch('/api/user/nickname', {
                                method: 'PUT'
                              });
                              if (response.ok) {
                                const data = await response.json();
                                setEditNickname(data.nickname);
                                setIsEditing(true);
                              }
                            } catch (error) {
                              console.error('Error generating nickname:', error);
                              setEditNickname('Koffieliefhebber');
                              setIsEditing(true);
                            }
                          }}
                                                     className="border-amber-300 text-amber-700 hover:bg-amber-50 text-sm sm:text-base"
                         >
                           <Users className="w-4 h-4 mr-2" />
                           Geef me een grappige naam! 🎲
                         </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Edit nickname form - mobile friendly design */}
          {isEditing && (
            <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl border-2 border-amber-200 shadow-md">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Input
                    value={editNickname}
                    onChange={(e) => setEditNickname(e.target.value)}
                    placeholder="Jouw grappige bijnaam..."
                    className="flex-1 text-base sm:text-sm"
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generateRandomNickname}
                    disabled={isLoading}
                    className="border-amber-300 text-amber-700 hover:bg-amber-50 w-full sm:w-auto"
                    title="Genereer nieuwe grappige bijnaam"
                  >
                    <Shuffle className="w-4 h-4 mr-2 sm:mr-1" />
                    <span className="sm:hidden">Andere naam! 🎲</span>
                    <span className="hidden sm:inline">Andere! 🎲</span>
                  </Button>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-3 sm:justify-end">
                  <Button
                    variant="outline"
                    onClick={cancelEdit}
                    disabled={isLoading}
                    className="border-amber-300 text-amber-700 hover:bg-amber-50 w-full sm:w-auto order-2 sm:order-1"
                  >
                    Annuleren
                  </Button>
                  <Button
                    onClick={saveNickname}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-md w-full sm:w-auto order-1 sm:order-2"
                  >
                    {isLoading ? 'Opslaan...' : 'Opslaan'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action buttons for logged-in users - mobile friendly */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center items-center">
          <Button asChild size="lg" className="text-base sm:text-lg px-6 py-4 sm:px-10 sm:py-8 w-full sm:w-auto bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300 sm:transform sm:hover:scale-105">
            <Link href="/create">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
              Start een Meetup
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="text-base sm:text-lg px-6 py-4 sm:px-10 sm:py-8 w-full sm:w-auto border-2 border-amber-300 hover:bg-amber-50 hover:border-amber-400 transition-all duration-300">
            <Link href="/dashboard">
              <Eye className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
              Mijn Meetups
            </Link>
          </Button>
        </div>

        {/* Logout button - mobile friendly */}
        <div className="flex justify-center">
          <Button 
            variant="ghost" 
            size="lg" 
            onClick={async () => {
              if (supabase) {
                await supabase.auth.signOut();
              }
            }}
            className="text-muted-foreground hover:text-foreground hover:bg-muted px-4 py-2 sm:px-6 sm:py-3 rounded-full transition-all duration-200 text-sm sm:text-base"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Uitloggen
          </Button>
        </div>
      </div>
    );
  }

  // Not logged in - show normal buttons - mobile friendly
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center items-center mb-8 sm:mb-12">
      <Button asChild size="lg" className="text-base sm:text-lg px-6 py-4 sm:px-10 sm:py-8 w-full sm:w-auto bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300 sm:transform sm:hover:scale-105">
        <Link href="/auth/signin?redirect=%2Fcreate">
          <Users className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
          Start een Meetup
        </Link>
      </Button>
      
      <Button asChild variant="outline" size="lg" className="text-base sm:text-lg px-6 py-4 sm:px-10 sm:py-8 w-full sm:w-auto border-2 border-amber-300 hover:bg-amber-50 hover:border-amber-400 transition-all duration-300">
        <Link href="/auth/signin">
          <LogIn className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
          Inloggen
        </Link>
      </Button>
      
      <Button asChild variant="outline" size="lg" className="text-base sm:text-lg px-6 py-4 sm:px-10 sm:py-8 w-full sm:w-auto border-2 border-amber-300 hover:bg-amber-50 hover:border-amber-400 transition-all duration-300">
        <Link href="/auth/signup">
          <Calendar className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
          Lid worden
        </Link>
      </Button>
    </div>
  );
} 