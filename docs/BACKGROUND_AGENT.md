# Background Agent Documentation

## Overview

The Background Agent is a comprehensive service worker system that provides background notifications, data synchronization, and offline capabilities for the Anemi Meets application. It runs independently of the main application and can perform tasks even when the app is not actively being used.

## Features

### 🔄 Background Sync
- **Periodic Data Sync**: Automatically syncs meetup data every 15 minutes
- **Offline Support**: Caches data for offline access
- **User Preferences**: Syncs user settings and preferences
- **Meetup Updates**: Checks for new invitations, reminders, and updates

### 📱 Push Notifications
- **Meetup Invitations**: Notifies users of new coffee meetup invitations
- **Reminders**: Sends reminders for upcoming meetups
- **Updates**: Notifies when meetups are modified
- **Interactive**: Click notifications to open relevant meetup pages

### 🛡️ Offline Capabilities
- **Cache Management**: Intelligent caching of API responses
- **Offline Queue**: Queues requests when offline for later sync
- **Graceful Degradation**: App continues to work with cached data

### 🔧 Developer Tools
- **Status Monitoring**: Real-time status of background agent
- **Test Interface**: Built-in testing tools for development
- **Debug Information**: Detailed logging and debugging capabilities

## Architecture

### Service Worker (`/public/background-agent.js`)
The main service worker that handles all background operations:

```javascript
// Key components:
- Background sync operations
- Push notification handling
- Cache management
- Message passing with main app
- Health monitoring
```

### Client Library (`/src/lib/background-agent.ts`)
TypeScript library for communicating with the service worker:

```typescript
// Features:
- Service worker registration
- Message passing
- Push notification management
- State management
```

### React Hook (`/src/lib/use-background-agent.ts`)
React hook for easy integration:

```typescript
// Provides:
- Background agent state
- Action methods
- Event handlers
- Status monitoring
```

### Provider Component (`/src/components/BackgroundAgentProvider.tsx`)
React context provider for app-wide access:

```typescript
// Manages:
- Auto-registration
- Lifecycle management
- Event handling
- State distribution
```

## Usage

### Basic Setup

The background agent is automatically registered when the app loads:

```typescript
// In your app layout
<BackgroundAgentProvider autoRegister={true} enableNotifications={true}>
  <YourApp />
</BackgroundAgentProvider>
```

### Using the Hook

```typescript
import { useBackgroundAgentContext } from '@/components/BackgroundAgentProvider';

function MyComponent() {
  const {
    isActive,
    isSupported,
    requestNotification,
    requestSync,
    subscribeToPushNotifications,
  } = useBackgroundAgentContext();

  // Request a notification
  const sendNotification = async () => {
    await requestNotification({
      title: 'New Meetup!',
      body: 'You have a new coffee meetup invitation',
      icon: '/logo-simple.svg',
    });
  };

  // Request background sync
  const syncData = async () => {
    await requestSync({
      type: 'meetup-sync',
      data: { userId: 'user123' },
    });
  };

  return (
    <div>
      {isActive && <p>Background agent is active</p>}
      <button onClick={sendNotification}>Send Notification</button>
      <button onClick={syncData}>Sync Data</button>
    </div>
  );
}
```

### Status Component

Use the built-in status component to show agent status:

```typescript
import { BackgroundAgentStatus } from '@/components/BackgroundAgentStatus';

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <BackgroundAgentStatus />
      {/* Your dashboard content */}
    </div>
  );
}
```

## API Endpoints

### Check Meetup Updates
`GET /api/meetups/check-updates`

Checks for new meetup updates and returns notifications to send:

```typescript
// Response format
[
  {
    type: 'new_invite',
    meetup: { /* meetup data */ },
    user: { /* inviter data */ },
  },
  {
    type: 'meetup_reminder',
    meetup: { /* meetup data */ },
  },
  {
    type: 'meetup_updated',
    meetup: { /* meetup data */ },
  }
]
```

## Configuration

### Environment Variables

Add these to your `.env.local`:

```env
# VAPID keys for push notifications (optional)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key

# Background agent settings
NEXT_PUBLIC_BACKGROUND_AGENT_ENABLED=true
NEXT_PUBLIC_BACKGROUND_SYNC_INTERVAL=900000
```

### Next.js Configuration

The service worker is configured in `next.config.js`:

```javascript
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  sw: '/background-agent.js', // Custom service worker
  disable: process.env.NODE_ENV === 'development',
});
```

## Testing

### Test Page
Visit `/test-background-agent` to test all background agent features:

- ✅ Test notifications
- ✅ Test background sync
- ✅ Test message passing
- ✅ View debug information
- ✅ Monitor agent status

### Manual Testing

1. **Notification Testing**:
   ```javascript
   // In browser console
   navigator.serviceWorker.ready.then(registration => {
     registration.showNotification('Test', {
       body: 'Test notification',
       icon: '/logo-simple.svg'
     });
   });
   ```

2. **Sync Testing**:
   ```javascript
   // Trigger background sync
   navigator.serviceWorker.ready.then(registration => {
     registration.sync.register('meetup-sync');
   });
   ```

3. **Message Testing**:
   ```javascript
   // Send message to service worker
   navigator.serviceWorker.controller.postMessage({
     type: 'background-agent:test-message',
     data: { test: true }
   });
   ```

## Troubleshooting

### Common Issues

1. **Service Worker Not Registering**:
   - Check browser console for errors
   - Ensure HTTPS is used (required for service workers)
   - Check if service workers are supported

2. **Notifications Not Working**:
   - Check notification permissions
   - Ensure VAPID keys are configured
   - Verify service worker is active

3. **Sync Not Working**:
   - Check network connectivity
   - Verify API endpoints are accessible
   - Check service worker logs

### Debug Tools

1. **Chrome DevTools**:
   - Application tab → Service Workers
   - Console tab for service worker logs
   - Network tab for API calls

2. **Built-in Debug Info**:
   - Visit `/test-background-agent`
   - View debug information panel
   - Check agent status

3. **Service Worker Logs**:
   ```javascript
   // In browser console
   navigator.serviceWorker.getRegistrations().then(registrations => {
     console.log('Service Workers:', registrations);
   });
   ```

## Security Considerations

### Data Protection
- All cached data is stored locally
- No sensitive data is exposed in notifications
- API calls use proper authentication

### Privacy
- Notifications require explicit user permission
- Push subscriptions are user-controlled
- Background sync respects user preferences

### Best Practices
- Always check permissions before sending notifications
- Handle offline scenarios gracefully
- Provide clear user feedback for all operations

## Performance

### Optimization
- Service worker is lightweight and efficient
- Caching reduces network requests
- Background sync is batched and optimized

### Monitoring
- Health checks every minute
- Automatic error recovery
- Performance metrics logging

## Browser Support

### Supported Browsers
- ✅ Chrome 40+
- ✅ Firefox 44+
- ✅ Safari 11.1+
- ✅ Edge 17+

### Feature Support
- ✅ Service Workers
- ✅ Push Notifications
- ✅ Background Sync
- ✅ Cache API

### Fallbacks
- Graceful degradation for unsupported features
- Alternative notification methods
- Offline-first design

## Development

### Local Development
1. Start development server: `npm run dev`
2. Visit `/test-background-agent`
3. Test all features
4. Check browser console for logs

### Production Deployment
1. Build the app: `npm run build`
2. Deploy to HTTPS environment
3. Configure VAPID keys for push notifications
4. Test background agent functionality

### Contributing
1. Follow existing code patterns
2. Add tests for new features
3. Update documentation
4. Test across different browsers

## Future Enhancements

### Planned Features
- [ ] Advanced offline capabilities
- [ ] Real-time meetup updates
- [ ] Location-based notifications
- [ ] Advanced caching strategies
- [ ] Performance optimizations

### Integration Ideas
- [ ] Calendar integration
- [ ] Social media sharing
- [ ] Advanced analytics
- [ ] Machine learning recommendations

---

For more information, see the [API Documentation](API_DOCUMENTATION.md) or contact the development team. 