"use client"

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, LogIn, Calendar, LogOut, Eye, Edit } from 'lucide-react';
import Link from 'next/link';
import { useSupabase } from '@/components/SupabaseProvider';
import { useState, useEffect } from 'react';
import { useToaster } from '@/components/ui/toaster';

interface UserNickname {
  nickname: string | null;
  email: string | null;
}

export function LoginStatus() {
  const { session, loading } = useSupabase();
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
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
        <Button asChild size="lg" className="text-lg px-8 py-6 bg-amber-600 hover:bg-amber-700">
          <Link href="/auth/signin?redirect=%2Fcreate">
            <Users className="w-5 h-5 mr-2" />
            Start een Meetup
          </Link>
        </Button>
        
        <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
          <Link href="/auth/signin">
            <LogIn className="w-5 h-5 mr-2" />
            Inloggen
          </Link>
        </Button>
        
        <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
          <Link href="/auth/signup">
            <Calendar className="w-5 h-5 mr-2" />
            Lid worden
          </Link>
        </Button>
      </div>
    );
  }

  // Logged in user - show welcome and appropriate buttons
  if (session) {
    return (
      <div className="space-y-6">
        {/* Welcome message with nickname - improved design */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-lg">☕</span>
                </div>
                <h3 className="text-xl font-bold text-green-800">
                  Welkom terug!
                </h3>
              </div>
              
              {userNickname?.nickname ? (
                <div className="flex items-center gap-3">
                  <p className="text-green-700 text-lg font-medium">
                    {userNickname.nickname}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="h-8 w-8 p-0 text-green-600 hover:text-green-800 hover:bg-green-100"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <p className="text-green-600 text-base">
                  {session.user.email}
                </p>
              )}
            </div>
          </div>

          {/* Edit nickname form - improved design */}
          {isEditing && (
            <div className="mt-4 p-4 bg-white rounded-xl border border-green-200 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  value={editNickname}
                  onChange={(e) => setEditNickname(e.target.value)}
                  placeholder="Jouw bijnaam..."
                  className="flex-1"
                  maxLength={50}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={saveNickname}
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Opslaan
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={cancelEdit}
                    disabled={isLoading}
                  >
                    Annuleren
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action buttons for logged-in users */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild size="lg" className="text-lg px-8 py-6 bg-amber-600 hover:bg-amber-700">
            <Link href="/create">
              <Users className="w-5 h-5 mr-2" />
              Start een Meetup
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
            <Link href="/dashboard">
              <Eye className="w-5 h-5 mr-2" />
              Mijn Meetups
            </Link>
          </Button>
        </div>

        {/* Logout button */}
        <div className="flex justify-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={async () => {
              const { supabase } = await import('@/components/SupabaseProvider').then(module => module.useSupabase());
              if (supabase) {
                await supabase.auth.signOut();
              }
            }}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Uitloggen
          </Button>
        </div>
      </div>
    );
  }

  // Not logged in - show normal buttons
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
      <Button asChild size="lg" className="text-lg px-8 py-6 bg-amber-600 hover:bg-amber-700">
        <Link href="/auth/signin?redirect=%2Fcreate">
          <Users className="w-5 h-5 mr-2" />
          Start een Meetup
        </Link>
      </Button>
      
      <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
        <Link href="/auth/signin">
          <LogIn className="w-5 h-5 mr-2" />
          Inloggen
        </Link>
      </Button>
      
      <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
        <Link href="/auth/signup">
          <Calendar className="w-5 h-5 mr-2" />
          Lid worden
        </Link>
      </Button>
    </div>
  );
} 