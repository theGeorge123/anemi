// Background Agent Client Library
// Provides interface to communicate with the background agent service worker

export interface BackgroundAgentState {
  isActive: boolean;
  lastSync: string | null;
  pendingNotifications: number;
  userSession: any | null;
}

export interface NotificationRequest {
  title: string;
  body: string;
  icon?: string;
  options?: NotificationOptions;
}

export interface SyncRequest {
  type: 'meetup-sync' | 'notification-sync' | 'data-sync';
  data?: any;
}

export interface BackgroundAgentMessage {
  type: string;
  data: any;
  timestamp: string;
}

class BackgroundAgentClient {
  private registration: ServiceWorkerRegistration | null = null;
  private messageHandlers: Map<string, (data: any) => void> = new Map();
  private state: BackgroundAgentState = {
    isActive: false,
    lastSync: null,
    pendingNotifications: 0,
    userSession: null,
  };

  constructor() {
    this.setupMessageListener();
  }

  // Register the background agent service worker
  async register(): Promise<boolean> {
    try {
      if ('serviceWorker' in navigator) {
        this.registration = await navigator.serviceWorker.register('/background-agent.js');
        
        console.log('✅ Background Agent: Registered successfully');
        
        // Wait for the service worker to be ready
        await navigator.serviceWorker.ready;
        
        // Register this client with the background agent
        await this.registerClient();
        
        return true;
      } else {
        console.warn('⚠️ Background Agent: Service workers not supported');
        return false;
      }
    } catch (error) {
      console.error('❌ Background Agent: Registration failed', error);
      return false;
    }
  }

  // Register this client with the background agent
  private async registerClient(): Promise<void> {
    if (!this.registration) return;

    const session = await this.getCurrentSession();
    
    this.sendMessage('background-agent:register', {
      session,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    });
  }

  // Get current user session
  private async getCurrentSession(): Promise<any> {
    // This would integrate with your Supabase auth
    // For now, return a basic session object
    return {
      userId: localStorage.getItem('user_id'),
      isAuthenticated: !!localStorage.getItem('user_id'),
    };
  }

  // Send message to background agent
  private sendMessage(type: string, data: any): void {
    if (this.registration && this.registration.active) {
      this.registration.active.postMessage({
        type,
        data,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Setup message listener for responses from background agent
  private setupMessageListener(): void {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        const { type, data, timestamp } = event.data;
        
        console.log('📨 Background Agent: Received message', { type, data, timestamp });
        
        // Update state based on message type
        this.updateState(type, data);
        
        // Call registered handlers
        const handler = this.messageHandlers.get(type);
        if (handler) {
          handler(data);
        }
      });
    }
  }

  // Update internal state based on background agent messages
  private updateState(type: string, data: any): void {
    switch (type) {
      case 'background-agent:agent-ready':
        this.state.isActive = data.status === 'active';
        break;
      case 'background-agent:health-check':
        this.state.lastSync = data.lastSync;
        this.state.pendingNotifications = data.pendingNotifications;
        break;
      case 'background-agent:registered':
        this.state.isActive = true;
        break;
    }
  }

  // Request background sync
  async requestSync(syncRequest: SyncRequest): Promise<boolean> {
    try {
      this.sendMessage('background-agent:sync-request', syncRequest);
      return true;
    } catch (error) {
      console.error('❌ Background Agent: Sync request failed', error);
      return false;
    }
  }

  // Request notification
  async requestNotification(notification: NotificationRequest): Promise<boolean> {
    try {
      this.sendMessage('background-agent:notification-request', notification);
      return true;
    } catch (error) {
      console.error('❌ Background Agent: Notification request failed', error);
      return false;
    }
  }

  // Register message handler
  onMessage(type: string, handler: (data: any) => void): void {
    this.messageHandlers.set(type, handler);
  }

  // Remove message handler
  offMessage(type: string): void {
    this.messageHandlers.delete(type);
  }

  // Get current state
  getState(): BackgroundAgentState {
    return { ...this.state };
  }

  // Check if background agent is active
  isActive(): boolean {
    return this.state.isActive;
  }

  // Request permission for notifications
  async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      return 'denied';
    }

    if (Notification.permission === 'default') {
      return await Notification.requestPermission();
    }

    return Notification.permission;
  }

  // Subscribe to push notifications
  async subscribeToPushNotifications(): Promise<PushSubscription | null> {
    try {
      if (!this.registration) {
        throw new Error('Service worker not registered');
      }

      const permission = await this.requestNotificationPermission();
      if (permission !== 'granted') {
        throw new Error('Notification permission not granted');
      }

      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
        ),
      });

      console.log('✅ Background Agent: Push subscription created');
      return subscription;
    } catch (error) {
      console.error('❌ Background Agent: Push subscription failed', error);
      return null;
    }
  }

  // Convert VAPID public key to Uint8Array
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Unsubscribe from push notifications
  async unsubscribeFromPushNotifications(): Promise<boolean> {
    try {
      if (!this.registration) {
        return false;
      }

      const subscription = await this.registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        console.log('✅ Background Agent: Push subscription removed');
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Background Agent: Push unsubscription failed', error);
      return false;
    }
  }

  // Check if push notifications are supported
  isPushSupported(): boolean {
    return 'serviceWorker' in navigator && 'PushManager' in window;
  }

  // Get push subscription status
  async getPushSubscriptionStatus(): Promise<{
    subscribed: boolean;
    permission: NotificationPermission;
  }> {
    if (!this.registration) {
      return { subscribed: false, permission: 'denied' };
    }

    const subscription = await this.registration.pushManager.getSubscription();
    const permission = await this.requestNotificationPermission();

    return {
      subscribed: !!subscription,
      permission,
    };
  }
}

// Create singleton instance
const backgroundAgent = new BackgroundAgentClient();

export default backgroundAgent; 