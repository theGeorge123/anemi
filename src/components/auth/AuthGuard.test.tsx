import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { AuthGuard } from './AuthGuard';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
    },
  },
}));

describe('AuthGuard', () => {
  const mockRouter = { push: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('redirects unauthenticated users to /auth/signin', async () => {
    if (!supabase) throw new Error('supabase is null');
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({ data: { session: null } });
    render(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    );
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/auth/signin');
    });
  });

  it('renders children for authenticated users', async () => {
    if (!supabase) throw new Error('supabase is null');
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({ data: { session: { user: { id: '123' } } } });
    render(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    );
    await waitFor(() => {
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });
}); 