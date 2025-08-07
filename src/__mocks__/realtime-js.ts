// Mock for @supabase/realtime-js
export const RealtimeClient = jest.fn(() => ({
  channel: jest.fn(() => ({
    on: jest.fn().mockReturnThis(),
    subscribe: jest.fn().mockReturnThis(),
    unsubscribe: jest.fn(),
  })),
  removeAllChannels: jest.fn(),
  disconnect: jest.fn(),
}))

export default {
  RealtimeClient,
} 