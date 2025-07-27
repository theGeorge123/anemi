// Background Agent Status Component
// Shows background agent status and allows user interaction

import React, { useState } from 'react';
import { useBackgroundAgentContext } from './BackgroundAgentProvider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function BackgroundAgentStatus() {
  const {
    state,
    isActive,
    isSupported,
    isInitialized,
    isRegistering,
    requestNotificationPermission,
    subscribeToPushNotifications,
    unsubscribeFromPushNotifications,
    getPushSubscriptionStatus,
  } = useBackgroundAgentContext();

  const [pushStatus, setPushStatus] = useState<{
    subscribed: boolean;
    permission: NotificationPermission;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check push subscription status
  const checkPushStatus = async () => {
    setIsLoading(true);
    try {
      const status = await getPushSubscriptionStatus();
      setPushStatus(status);
    } catch (error) {
      console.error('Failed to check push status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Request notification permission
  const handleRequestPermission = async () => {
    setIsLoading(true);
    try {
      const permission = await requestNotificationPermission();
      console.log('Notification permission:', permission);
      await checkPushStatus();
    } catch (error) {
      console.error('Failed to request permission:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Subscribe to push notifications
  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      const subscription = await subscribeToPushNotifications();
      if (subscription) {
        console.log('Push subscription created:', subscription);
        await checkPushStatus();
      }
    } catch (error) {
      console.error('Failed to subscribe:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Unsubscribe from push notifications
  const handleUnsubscribe = async () => {
    setIsLoading(true);
    try {
      const success = await unsubscribeFromPushNotifications();
      if (success) {
        console.log('Push subscription removed');
        await checkPushStatus();
      }
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check status on mount
  React.useEffect(() => {
    if (isInitialized) {
      checkPushStatus();
    }
  }, [isInitialized]);

  if (!isSupported) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🔄 Background Agent
            <Badge variant="secondary">Not Supported</Badge>
          </CardTitle>
          <CardDescription>
            Service workers are not supported in this browser
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Background notifications and sync are not available in this browser.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔄 Background Agent
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        </CardTitle>
        <CardDescription>
          Manages background notifications and data sync
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Status:</span>
            <span className={isActive ? "text-green-600" : "text-gray-500"}>
              {isRegistering ? "Registering..." : isActive ? "Active" : "Inactive"}
            </span>
          </div>
          
          {state.lastSync && (
            <div className="flex justify-between text-sm">
              <span>Last Sync:</span>
              <span className="text-muted-foreground">
                {new Date(state.lastSync).toLocaleTimeString()}
              </span>
            </div>
          )}
          
          <div className="flex justify-between text-sm">
            <span>Pending Notifications:</span>
            <span className="text-muted-foreground">
              {state.pendingNotifications}
            </span>
          </div>
        </div>

        {/* Push Notifications */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Push Notifications</h4>
          
          {pushStatus && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Permission:</span>
                <Badge variant={
                  pushStatus.permission === 'granted' ? 'default' : 
                  pushStatus.permission === 'denied' ? 'destructive' : 'secondary'
                }>
                  {pushStatus.permission}
                </Badge>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Subscribed:</span>
                <Badge variant={pushStatus.subscribed ? 'default' : 'secondary'}>
                  {pushStatus.subscribed ? 'Yes' : 'No'}
                </Badge>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleRequestPermission}
              disabled={isLoading}
            >
              Request Permission
            </Button>
            
            {pushStatus?.permission === 'granted' && !pushStatus?.subscribed && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleSubscribe}
                disabled={isLoading}
              >
                Subscribe
              </Button>
            )}
            
            {pushStatus?.subscribed && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleUnsubscribe}
                disabled={isLoading}
              >
                Unsubscribe
              </Button>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Actions</h4>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={checkPushStatus}
              disabled={isLoading}
            >
              Refresh Status
            </Button>
          </div>
        </div>

        {/* Debug Info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Debug Info</h4>
            <pre className="text-xs bg-muted p-2 rounded overflow-auto">
              {JSON.stringify({
                isSupported,
                isInitialized,
                isActive,
                isRegistering,
                state,
                pushStatus,
              }, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 