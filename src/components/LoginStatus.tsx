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

  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
        <Button asChild size="lg" className="text-lg px-10 py-8 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <Link href="/auth/signin?redirect=%2Fcreate">
            <Users className="w-6 h-6 mr-3" />
            Start een Meetup
          </Link>
        </Button>
        
        <Button asChild variant="outline" size="lg" className="text-lg px-10 py-8 border-2 border-amber-300 hover:bg-amber-50 hover:border-amber-400 transition-all duration-300">
          <Link href="/auth/signin">
            <LogIn className="w-6 h-6 mr-3" />
            Inloggen
          </Link>
        </Button>
        
        <Button asChild variant="outline" size="lg" className="text-lg px-10 py-8 border-2 border-amber-300 hover:bg-amber-50 hover:border-amber-400 transition-all duration-300">
          <Link href="/auth/signup">
            <Calendar className="w-6 h-6 mr-3" />
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
        {/* Welcome message with nickname - website consistent design */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-3xl p-8 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-amber-700 text-2xl">☕</span>
                </div>
                <h3 className="text-2xl font-display font-bold text-foreground">
                  Welkom terug!
                </h3>
              </div>
              
              {userNickname?.nickname ? (
                <div className="flex items-center gap-4">
                  <p className="text-muted-foreground text-xl font-medium">
                    {userNickname.nickname}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="h-10 w-10 p-0 text-amber-600 hover:text-amber-800 hover:bg-amber-100 rounded-full transition-all duration-200"
                    title="Bijnaam bewerken"
                  >
                    <Edit className="w-5 h-5" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <p className="text-muted-foreground text-lg">
                    {session.user.email}
                  </p>
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
                    className="border-amber-300 text-amber-700 hover:bg-amber-50"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Bijnaam toevoegen
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Edit nickname form - website consistent design */}
          {isEditing && (
            <div className="mt-6 p-6 bg-white rounded-2xl border-2 border-amber-200 shadow-md">
              <div className="flex flex-col gap-4">
                <div className="flex gap-2">
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
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={generateRandomNickname}
                    disabled={isLoading}
                    className="border-amber-300 text-amber-700 hover:bg-amber-50"
                    title="Genereer random bijnaam"
                  >
                    <Shuffle className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={cancelEdit}
                    disabled={isLoading}
                    className="border-amber-300 text-amber-700 hover:bg-amber-50"
                  >
                    Annuleren
                  </Button>
                  <Button
                    onClick={saveNickname}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-md"
                  >
                    Opslaan
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action buttons for logged-in users */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Button asChild size="lg" className="text-lg px-10 py-8 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <Link href="/create">
              <Users className="w-6 h-6 mr-3" />
              Start een Meetup
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="text-lg px-10 py-8 border-2 border-amber-300 hover:bg-amber-50 hover:border-amber-400 transition-all duration-300">
            <Link href="/dashboard">
              <Eye className="w-6 h-6 mr-3" />
              Mijn Meetups
            </Link>
          </Button>
        </div>

        {/* Logout button */}
        <div className="flex justify-center">
          <Button 
            variant="ghost" 
            size="lg" 
            onClick={async () => {
              if (supabase) {
                await supabase.auth.signOut();
              }
            }}
            className="text-muted-foreground hover:text-foreground hover:bg-muted px-6 py-3 rounded-full transition-all duration-200"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Uitloggen
          </Button>
        </div>
      </div>
    );
  }

  // Not logged in - show normal buttons
  return (
    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
      <Button asChild size="lg" className="text-lg px-10 py-8 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
        <Link href="/auth/signin?redirect=%2Fcreate">
          <Users className="w-6 h-6 mr-3" />
          Start een Meetup
        </Link>
      </Button>
      
      <Button asChild variant="outline" size="lg" className="text-lg px-10 py-8 border-2 border-amber-300 hover:bg-amber-50 hover:border-amber-400 transition-all duration-300">
        <Link href="/auth/signin">
          <LogIn className="w-6 h-6 mr-3" />
          Inloggen
        </Link>
      </Button>
      
      <Button asChild variant="outline" size="lg" className="text-lg px-10 py-8 border-2 border-amber-300 hover:bg-amber-50 hover:border-amber-400 transition-all duration-300">
        <Link href="/auth/signup">
          <Calendar className="w-6 h-6 mr-3" />
          Lid worden
        </Link>
      </Button>
    </div>
  );
} 