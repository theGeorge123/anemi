// Background Agent Provider
// Manages background agent lifecycle and provides it to the app

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useBackgroundAgent, UseBackgroundAgentReturn } from '@/lib/use-background-agent';

interface BackgroundAgentContextType extends UseBackgroundAgentReturn {
  isInitialized: boolean;
  isRegistering: boolean;
}

const BackgroundAgentContext = createContext<BackgroundAgentContextType | undefined>(undefined);

export function useBackgroundAgentContext() {
  const context = useContext(BackgroundAgentContext);
  if (context === undefined) {
    throw new Error('useBackgroundAgentContext must be used within a BackgroundAgentProvider');
  }
  return context;
}

interface BackgroundAgentProviderProps {
  children: React.ReactNode;
  autoRegister?: boolean;
  enableNotifications?: boolean;
  enablePushNotifications?: boolean;
}

export function BackgroundAgentProvider({
  children,
  autoRegister = true,
  enableNotifications = true,
  enablePushNotifications = false,
}: BackgroundAgentProviderProps) {
  const backgroundAgent = useBackgroundAgent();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // Auto-register background agent
  useEffect(() => {
    if (autoRegister && backgroundAgent.isSupported && !isInitialized) {
      const initializeAgent = async () => {
        setIsRegistering(true);
        try {
          const success = await backgroundAgent.register();
          if (success) {
            console.log('✅ Background Agent: Auto-registered successfully');
            
            // Enable notifications if requested
            if (enableNotifications) {
              await backgroundAgent.requestNotificationPermission();
            }
            
            // Enable push notifications if requested
            if (enablePushNotifications) {
              await backgroundAgent.subscribeToPushNotifications();
            }
            
            setIsInitialized(true);
          } else {
            console.warn('⚠️ Background Agent: Auto-registration failed');
          }
        } catch (error) {
          console.error('❌ Background Agent: Auto-registration error', error);
        } finally {
          setIsRegistering(false);
        }
      };

      initializeAgent();
    }
  }, [
    autoRegister,
    backgroundAgent.isSupported,
    isInitialized,
    backgroundAgent.register,
    enableNotifications,
    enablePushNotifications,
    backgroundAgent.requestNotificationPermission,
    backgroundAgent.subscribeToPushNotifications,
  ]);

  // Listen for background agent events
  useEffect(() => {
    if (!backgroundAgent.isActive) return;

    // Handle sync completion
    backgroundAgent.onMessage('background-agent:sync-complete', (data) => {
      console.log('✅ Background Agent: Sync completed', data);
    });

    // Handle sync errors
    backgroundAgent.onMessage('background-agent:sync-error', (data) => {
      console.error('❌ Background Agent: Sync error', data);
    });

    // Handle notification events
    backgroundAgent.onMessage('background-agent:notification-sent', (data) => {
      console.log('📱 Background Agent: Notification sent', data);
    });

    backgroundAgent.onMessage('background-agent:notification-error', (data) => {
      console.error('❌ Background Agent: Notification error', data);
    });

    return () => {
      backgroundAgent.offMessage('background-agent:sync-complete');
      backgroundAgent.offMessage('background-agent:sync-error');
      backgroundAgent.offMessage('background-agent:notification-sent');
      backgroundAgent.offMessage('background-agent:notification-error');
    };
  }, [backgroundAgent.isActive, backgroundAgent.onMessage, backgroundAgent.offMessage]);

  const contextValue: BackgroundAgentContextType = {
    ...backgroundAgent,
    isInitialized,
    isRegistering,
  };

  return (
    <BackgroundAgentContext.Provider value={contextValue}>
      {children}
    </BackgroundAgentContext.Provider>
  );
} 