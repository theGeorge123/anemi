"use client"

// React Hook for Background Agent
// Provides easy access to background agent functionality

import { useState, useEffect, useCallback } from 'react';
import backgroundAgent, { 
  BackgroundAgentState, 
  NotificationRequest, 
  SyncRequest 
} from './background-agent';

export interface UseBackgroundAgentReturn {
  // State
  state: BackgroundAgentState;
  isActive: boolean;
  isSupported: boolean;
  
  // Actions
  register: () => Promise<boolean>;
  requestSync: (syncRequest: SyncRequest) => Promise<boolean>;
  requestNotification: (notification: NotificationRequest) => Promise<boolean>;
  requestNotificationPermission: () => Promise<NotificationPermission>;
  subscribeToPushNotifications: () => Promise<PushSubscription | null>;
  unsubscribeFromPushNotifications: () => Promise<boolean>;
  
  // Status
  getPushSubscriptionStatus: () => Promise<{
    subscribed: boolean;
    permission: NotificationPermission;
  }>;
  
  // Event handlers
  onMessage: (type: string, handler: (data: any) => void) => void;
  offMessage: (type: string) => void;
}

export function useBackgroundAgent(): UseBackgroundAgentReturn {
  const [state, setState] = useState<BackgroundAgentState>({
    isActive: false,
    lastSync: null,
    pendingNotifications: 0,
    userSession: null,
  });
  
  const [isSupported] = useState(() => {
    return 'serviceWorker' in navigator && 'PushManager' in window;
  });

  // Update state when background agent state changes
  useEffect(() => {
    const updateState = () => {
      setState(backgroundAgent.getState());
    };

    // Initial state
    updateState();

    // Listen for state changes
    backgroundAgent.onMessage('background-agent:agent-ready', updateState);
    backgroundAgent.onMessage('background-agent:health-check', updateState);
    backgroundAgent.onMessage('background-agent:registered', updateState);

    return () => {
      backgroundAgent.offMessage('background-agent:agent-ready');
      backgroundAgent.offMessage('background-agent:health-check');
      backgroundAgent.offMessage('background-agent:registered');
    };
  }, []);

  // Register background agent
  const register = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      console.warn('⚠️ Background Agent: Not supported in this browser');
      return false;
    }

    try {
      const success = await backgroundAgent.register();
      if (success) {
        setState(backgroundAgent.getState());
      }
      return success;
    } catch (error) {
      console.error('❌ Background Agent: Registration failed', error);
      return false;
    }
  }, [isSupported]);

  // Request sync
  const requestSync = useCallback(async (syncRequest: SyncRequest): Promise<boolean> => {
    try {
      return await backgroundAgent.requestSync(syncRequest);
    } catch (error) {
      console.error('❌ Background Agent: Sync request failed', error);
      return false;
    }
  }, []);

  // Request notification
  const requestNotification = useCallback(async (notification: NotificationRequest): Promise<boolean> => {
    try {
      return await backgroundAgent.requestNotification(notification);
    } catch (error) {
      console.error('❌ Background Agent: Notification request failed', error);
      return false;
    }
  }, []);

  // Request notification permission
  const requestNotificationPermission = useCallback(async (): Promise<NotificationPermission> => {
    try {
      return await backgroundAgent.requestNotificationPermission();
    } catch (error) {
      console.error('❌ Background Agent: Permission request failed', error);
      return 'denied';
    }
  }, []);

  // Subscribe to push notifications
  const subscribeToPushNotifications = useCallback(async (): Promise<PushSubscription | null> => {
    try {
      return await backgroundAgent.subscribeToPushNotifications();
    } catch (error) {
      console.error('❌ Background Agent: Push subscription failed', error);
      return null;
    }
  }, []);

  // Unsubscribe from push notifications
  const unsubscribeFromPushNotifications = useCallback(async (): Promise<boolean> => {
    try {
      return await backgroundAgent.unsubscribeFromPushNotifications();
    } catch (error) {
      console.error('❌ Background Agent: Push unsubscription failed', error);
      return false;
    }
  }, []);

  // Get push subscription status
  const getPushSubscriptionStatus = useCallback(async () => {
    try {
      return await backgroundAgent.getPushSubscriptionStatus();
    } catch (error) {
      console.error('❌ Background Agent: Status check failed', error);
      return { subscribed: false, permission: 'denied' as NotificationPermission };
    }
  }, []);

  // Message handlers
  const onMessage = useCallback((type: string, handler: (data: any) => void) => {
    backgroundAgent.onMessage(type, handler);
  }, []);

  const offMessage = useCallback((type: string) => {
    backgroundAgent.offMessage(type);
  }, []);

  return {
    // State
    state,
    isActive: state.isActive,
    isSupported,
    
    // Actions
    register,
    requestSync,
    requestNotification,
    requestNotificationPermission,
    subscribeToPushNotifications,
    unsubscribeFromPushNotifications,
    
    // Status
    getPushSubscriptionStatus,
    
    // Event handlers
    onMessage,
    offMessage,
  };
} 