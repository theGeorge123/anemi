// Background Agent for Anemi Meets
// Handles notifications, data sync, and background tasks

const CACHE_NAME = 'anemi-meets-v1';
const API_BASE_URL = self.location.origin;

// Background Agent Configuration
const AGENT_CONFIG = {
  syncInterval: 15 * 60 * 1000, // 15 minutes
  notificationTimeout: 5000,
  maxRetries: 3,
  retryDelay: 1000,
};

// Background Agent State
let agentState = {
  isActive: false,
  lastSync: null,
  pendingNotifications: [],
  syncQueue: [],
  userSession: null,
};

// Initialize Background Agent
self.addEventListener('install', (event) => {
  console.log('🔄 Background Agent: Installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('🚀 Background Agent: Activating...');
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      initializeAgent(),
      clearOldCaches(),
    ])
  );
});

// Initialize the background agent
async function initializeAgent() {
  try {
    agentState.isActive = true;
    console.log('✅ Background Agent: Initialized');
    
    // Start background tasks
    startPeriodicSync();
    startNotificationManager();
    startDataSync();
    
    // Notify all clients that agent is ready
    notifyClients('agent-ready', { status: 'active' });
  } catch (error) {
    console.error('❌ Background Agent: Initialization failed', error);
  }
}

// Periodic sync for meetups and notifications
function startPeriodicSync() {
  setInterval(async () => {
    if (agentState.isActive) {
      await performBackgroundSync();
    }
  }, AGENT_CONFIG.syncInterval);
}

// Background sync operation
async function performBackgroundSync() {
  try {
    console.log('🔄 Background Agent: Starting sync...');
    
    // Check for new meetups
    await checkNewMeetups();
    
    // Check for pending notifications
    await processPendingNotifications();
    
    // Update last sync time
    agentState.lastSync = new Date().toISOString();
    
    console.log('✅ Background Agent: Sync completed');
  } catch (error) {
    console.error('❌ Background Agent: Sync failed', error);
  }
}

// Check for new meetups and send notifications
async function checkNewMeetups() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/meetups/check-updates`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const updates = await response.json();
      
      for (const update of updates) {
        await sendMeetupNotification(update);
      }
    }
  } catch (error) {
    console.error('❌ Background Agent: Meetup check failed', error);
  }
}

// Send meetup notification
async function sendMeetupNotification(meetupUpdate) {
  const { type, meetup, user } = meetupUpdate;
  
  let title, body, icon;
  
  switch (type) {
    case 'new_invite':
      title = '☕ Nieuwe Koffie Meetup Uitnodiging';
      body = `${user.name} heeft je uitgenodigd voor een koffie meetup!`;
      icon = '/logo-simple.svg';
      break;
    case 'meetup_reminder':
      title = '⏰ Koffie Meetup Herinnering';
      body = `Je hebt over 1 uur een koffie meetup: ${meetup.title}`;
      icon = '/logo-simple.svg';
      break;
    case 'meetup_updated':
      title = '📝 Meetup Bijgewerkt';
      body = `${meetup.title} is bijgewerkt`;
      icon = '/logo-simple.svg';
      break;
    default:
      return;
  }

  await showNotification(title, body, icon, {
    data: {
      type: 'meetup_update',
      meetupId: meetup.id,
      action: type,
    },
    actions: [
      {
        action: 'view',
        title: 'Bekijk',
      },
      {
        action: 'dismiss',
        title: 'Sluiten',
      },
    ],
  });
}

// Notification manager
function startNotificationManager() {
  // Handle notification clicks
  self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    const { action, data } = event.notification;
    
    if (action === 'view' && data) {
      // Open the meetup page
      event.waitUntil(
        self.clients.openWindow(`/meetups/${data.meetupId}`)
      );
    }
  });
}

// Show notification with retry logic
async function showNotification(title, body, icon, options = {}) {
  const notificationOptions = {
    body,
    icon: icon || '/logo-simple.svg',
    badge: '/logo-simple.svg',
    tag: 'anemi-meets-notification',
    requireInteraction: false,
    ...options,
  };

  try {
    const permission = await self.registration.pushManager.permissionState({
      userVisibleOnly: true,
    });

    if (permission === 'granted') {
      await self.registration.showNotification(title, notificationOptions);
    } else {
      // Fallback to basic notification
      await self.registration.showNotification(title, {
        body,
        icon: '/logo-simple.svg',
      });
    }
  } catch (error) {
    console.error('❌ Background Agent: Notification failed', error);
  }
}

// Process pending notifications
async function processPendingNotifications() {
  for (const notification of agentState.pendingNotifications) {
    try {
      await showNotification(
        notification.title,
        notification.body,
        notification.icon,
        notification.options
      );
    } catch (error) {
      console.error('❌ Background Agent: Pending notification failed', error);
    }
  }
  
  agentState.pendingNotifications = [];
}

// Data sync operations
async function startDataSync() {
  // Sync user preferences
  await syncUserPreferences();
  
  // Sync offline data
  await syncOfflineData();
}

// Sync user preferences
async function syncUserPreferences() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/user/preferences`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const preferences = await response.json();
      await cacheUserPreferences(preferences);
    }
  } catch (error) {
    console.error('❌ Background Agent: Preferences sync failed', error);
  }
}

// Cache user preferences
async function cacheUserPreferences(preferences) {
  const cache = await caches.open('user-preferences');
  await cache.put('/api/user/preferences', new Response(JSON.stringify(preferences)));
}

// Sync offline data
async function syncOfflineData() {
  try {
    const cache = await caches.open('offline-data');
    const requests = await cache.keys();
    
    for (const request of requests) {
      if (request.url.includes('/api/')) {
        await syncOfflineRequest(request);
      }
    }
  } catch (error) {
    console.error('❌ Background Agent: Offline sync failed', error);
  }
}

// Sync offline request
async function syncOfflineRequest(request) {
  try {
    const response = await fetch(request.url, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });

    if (response.ok) {
      // Remove from offline cache if sync successful
      const cache = await caches.open('offline-data');
      await cache.delete(request);
    }
  } catch (error) {
    console.error('❌ Background Agent: Offline request sync failed', error);
  }
}

// Handle push notifications
self.addEventListener('push', (event) => {
  console.log('📱 Background Agent: Push notification received');
  
  if (event.data) {
    try {
      const data = event.data.json();
      handlePushNotification(data);
    } catch (error) {
      console.error('❌ Background Agent: Push notification parsing failed', error);
    }
  }
});

// Handle push notification data
async function handlePushNotification(data) {
  const { type, payload } = data;
  
  switch (type) {
    case 'meetup_invite':
      await sendMeetupNotification({
        type: 'new_invite',
        meetup: payload.meetup,
        user: payload.user,
      });
      break;
    case 'meetup_reminder':
      await sendMeetupNotification({
        type: 'meetup_reminder',
        meetup: payload.meetup,
      });
      break;
    case 'meetup_update':
      await sendMeetupNotification({
        type: 'meetup_updated',
        meetup: payload.meetup,
      });
      break;
    default:
      console.log('📱 Background Agent: Unknown push notification type', type);
  }
}

// Handle background sync
self.addEventListener('sync', (event) => {
  console.log('🔄 Background Agent: Background sync triggered', event.tag);
  
  event.waitUntil(
    handleBackgroundSync(event.tag)
  );
});

// Handle different sync types
async function handleBackgroundSync(syncTag) {
  switch (syncTag) {
    case 'meetup-sync':
      await performBackgroundSync();
      break;
    case 'notification-sync':
      await processPendingNotifications();
      break;
    case 'data-sync':
      await startDataSync();
      break;
    default:
      console.log('🔄 Background Agent: Unknown sync tag', syncTag);
  }
}

// Notify clients about agent events
function notifyClients(type, data) {
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({
        type: `background-agent:${type}`,
        data,
        timestamp: new Date().toISOString(),
      });
    });
  });
}

// Handle messages from clients
self.addEventListener('message', (event) => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'background-agent:register':
      handleClientRegistration(event.source, data);
      break;
    case 'background-agent:sync-request':
      handleSyncRequest(event.source, data);
      break;
    case 'background-agent:notification-request':
      handleNotificationRequest(event.source, data);
      break;
    default:
      console.log('📨 Background Agent: Unknown message type', type);
  }
});

// Handle client registration
function handleClientRegistration(client, data) {
  agentState.userSession = data.session;
  console.log('✅ Background Agent: Client registered');
  
  client.postMessage({
    type: 'background-agent:registered',
    data: { status: 'success' },
  });
}

// Handle sync request from client
async function handleSyncRequest(client, data) {
  try {
    await performBackgroundSync();
    
    client.postMessage({
      type: 'background-agent:sync-complete',
      data: { success: true },
    });
  } catch (error) {
    client.postMessage({
      type: 'background-agent:sync-error',
      data: { error: error.message },
    });
  }
}

// Handle notification request from client
async function handleNotificationRequest(client, data) {
  try {
    await showNotification(
      data.title,
      data.body,
      data.icon,
      data.options
    );
    
    client.postMessage({
      type: 'background-agent:notification-sent',
      data: { success: true },
    });
  } catch (error) {
    client.postMessage({
      type: 'background-agent:notification-error',
      data: { error: error.message },
    });
  }
}

// Clear old caches
async function clearOldCaches() {
  const cacheNames = await caches.keys();
  const oldCaches = cacheNames.filter(name => name !== CACHE_NAME);
  
  await Promise.all(
    oldCaches.map(name => caches.delete(name))
  );
  
  console.log('🧹 Background Agent: Old caches cleared');
}

// Handle fetch events for offline support
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/')) {
    event.respondWith(handleApiRequest(event.request));
  }
});

// Handle API requests with offline support
async function handleApiRequest(request) {
  try {
    const response = await fetch(request);
    return response;
  } catch (error) {
    // If offline, try to get from cache
    const cache = await caches.open('offline-data');
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Store request for later sync
    await cache.put(request, new Response('Offline'));
    
    return new Response('Offline', {
      status: 503,
      statusText: 'Service Unavailable',
    });
  }
}

// Background Agent Health Check
setInterval(() => {
  if (agentState.isActive) {
    console.log('💚 Background Agent: Health check - OK');
    notifyClients('health-check', {
      status: 'healthy',
      lastSync: agentState.lastSync,
      pendingNotifications: agentState.pendingNotifications.length,
    });
  }
}, 60000); // Every minute

console.log('🚀 Background Agent: Service worker loaded'); 