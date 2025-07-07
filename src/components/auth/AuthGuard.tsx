import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      if (!supabase) {
        router.push('/auth/signin');
        return;
      }
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
      setIsLoading(false);
      if (!data.session) {
        router.push('/auth/signin');
      }
    };
    checkAuth();
  }, [router]);

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return null;
  return <>{children}</>;
} 