"use client";

import { createContext, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageService } from '@/lib/language-service';
import { SupabaseProvider } from './SupabaseProvider';

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

interface LanguageContextType {
  changeLanguage: (lang: string) => void;
}

export const LanguageContext = createContext<LanguageContextType>({ changeLanguage: () => {} });

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const preferredLang = LanguageService.getPreferredLanguage();
    i18n.changeLanguage(preferredLang);
  }, [i18n]);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    LanguageService.setPreferredLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SupabaseProvider>
      <ToasterProvider>
        <AppProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </AppProvider>
      </ToasterProvider>
    </SupabaseProvider>
  );
} 