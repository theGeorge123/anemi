'use client';

import { createContext, useContext } from 'react';

// Simple context for the Tiny-MVP
interface AppContextType {
  // Add any app-wide state here if needed
}

const AppContext = createContext<AppContextType>({});

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const value = {
    // Add any app-wide state here if needed
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Simple Toaster Provider
function ToasterProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToasterProvider>
      <AppProvider>
        {children}
      </AppProvider>
    </ToasterProvider>
  );
} 