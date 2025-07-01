# API Documentation

Complete API reference for Anemi Meets platform.

## 📋 Overview

The Anemi Meets API is built with Next.js 14 App Router and provides RESTful endpoints for managing meetups, coffee shops, users, and invitations.

**Base URL**: `https://your-domain.com/api`

**Authentication**: JWT tokens via NextAuth.js

## 🔐 Authentication

### Headers
```http
Authorization: Bearer <token>
Content-Type: application/json
```

### Error Responses
```json
{
  "error": "Unauthorized",
  "status": 401
}
```

## 📍 Endpoints

### Health Check

#### GET `/api/health`
Check API health status.

**Response**
```json
{
  "status": "ok",
  "timestamp": "2025-01-15T10:30:00Z",
  "version": "1.0.0"
}
```

---

### Meetup Invitations

#### GET `/api/invite/[token]`
Get invitation details by token.

**Parameters**
- `token` (string, required): Invitation token

**Response**
```json
{
  "id": "inv_123",
  "token": "abc123",
  "cafe": {
    "id": "cafe_456",
    "name": "Coffee Corner",
    "address": "123 Main St",
    "priceRange": "MODERATE",
    "rating": 4.5,
    "openHours": "Open daily",
    "isVerified": true,
    "description": "Cozy coffee shop"
  },
  "formData": {
    "name": "John Doe",
    "email": "john@example.com",
    "dates": ["2025-01-20", "2025-01-21"],
    "priceRange": "MODERATE"
  },
  "status": "pending",
  "chosenDate": null
}
```

#### POST `/api/invite/[token]/confirm`
Confirm an invitation.

**Request Body**
```json
{
  "chosenDate": "2025-01-20",
  "participantName": "Jane Smith",
  "participantEmail": "jane@example.com"
}
```

**Response**
```json
{
  "success": true,
  "meetupId": "meetup_789",
  "message": "Invitation confirmed successfully"
}
```

---

### Send Invitations

#### POST `/api/send-invite`
Send a new invitation.

**Request Body**
```json
{
  "organizerName": "John Doe",
  "organizerEmail": "john@example.com",
  "cafeId": "cafe_456",
  "availableDates": ["2025-01-20", "2025-01-21", "2025-01-22"],
  "message": "Let's grab coffee!"
}
```

**Response**
```json
{
  "success": true,
  "inviteId": "inv_123",
  "token": "abc123",
  "inviteUrl": "https://your-domain.com/invite/abc123"
}
```

---

### Coffee Shop Discovery

#### POST `/api/shuffle-cafe`
Get a random coffee shop based on criteria.

**Request Body**
```json
{
  "city": "Amsterdam",
  "priceRange": "MODERATE"
}
```

**Response**
```json
{
  "id": "cafe_456",
  "name": "Coffee Corner",
  "city": "Amsterdam",
  "address": "123 Main St",
  "priceRange": "MODERATE",
  "rating": 4.5,
  "openHours": "Open daily",
  "isVerified": true,
  "description": "Cozy coffee shop in the heart of Amsterdam"
}
```

## 📊 Data Models

### MeetupInvite
```typescript
interface MeetupInvite {
  id: string;
  token: string;
  organizerName: string;
  organizerEmail: string;
  cafeId: string;
  availableDates: string[]; // ISO date strings
  chosenDate?: string; // ISO date string
  status: 'pending' | 'confirmed' | 'expired';
  expiresAt: Date;
  confirmedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  cafe: CoffeeShop;
}
```

### CoffeeShop
```typescript
interface CoffeeShop {
  id: string;
  name: string;
  description?: string;
  city: 'Amsterdam' | 'Rotterdam';
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  website?: string;
  rating: number;
  reviewCount: number;
  priceRange: 'BUDGET' | 'MODERATE' | 'PREMIUM';
  features: string[]; // ['wifi', 'parking', 'outdoor_seating']
  hours?: any; // JSON object
  photos: string[];
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🚨 Error Handling

### Standard Error Response
```json
{
  "error": "Error message",
  "status": 400,
  "details": "Additional error details"
}
```

### Common Error Codes
- `400` - Bad Request (invalid input)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

## 🔄 Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **General endpoints**: 100 requests per minute
- **Invitation endpoints**: 10 requests per minute
- **Shuffle cafe**: 10 requests per 10 seconds

Rate limit headers:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642234567
```

## 📝 Usage Examples

### JavaScript/TypeScript

```typescript
// Send an invitation
const sendInvite = async (inviteData) => {
  const response = await fetch('/api/send-invite', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(inviteData),
  });
  
  return response.json();
};

// Get invitation details
const getInvite = async (token) => {
  const response = await fetch(`/api/invite/${token}`);
  return response.json();
};

// Confirm invitation
const confirmInvite = async (token, confirmData) => {
  const response = await fetch(`/api/invite/${token}/confirm`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(confirmData),
  });
  
  return response.json();
};

// Get random coffee shop
const shuffleCafe = async (criteria) => {
  const response = await fetch('/api/shuffle-cafe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(criteria),
  });
  
  return response.json();
};
```

### cURL Examples

```bash
# Send invitation
curl -X POST https://your-domain.com/api/send-invite \
  -H "Content-Type: application/json" \
  -d '{
    "organizerName": "John Doe",
    "organizerEmail": "john@example.com",
    "cafeId": "cafe_456",
    "availableDates": ["2025-01-20", "2025-01-21"],
    "message": "Let\'s grab coffee!"
  }'

# Get invitation
curl https://your-domain.com/api/invite/abc123

# Confirm invitation
curl -X POST https://your-domain.com/api/invite/abc123/confirm \
  -H "Content-Type: application/json" \
  -d '{
    "chosenDate": "2025-01-20",
    "participantName": "Jane Smith",
    "participantEmail": "jane@example.com"
  }'

# Shuffle cafe
curl -X POST https://your-domain.com/api/shuffle-cafe \
  -H "Content-Type: application/json" \
  -d '{
    "city": "Amsterdam",
    "priceRange": "MODERATE"
  }'
```

## 🔧 Development

### Local Development
```bash
# Start development server
npm run dev

# API will be available at
# http://localhost:3000/api
```

### Testing API Endpoints
```bash
# Run API tests
npm run test:api

# Test specific endpoint
npm run test:api -- --grep "invite"
```

## 📚 Related Documentation

- [Database Schema](../development/database-schema.md)
- [Authentication](../features/authentication.md)
- [Email System](../features/email-system.md)
- [Rate Limiting](../security/rate-limiting.md)

---

*For questions or issues, please create an issue on GitHub.* 