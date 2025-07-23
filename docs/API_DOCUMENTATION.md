# Anemi Meets API Documentation

## 🔐 Authentication

### Supabase Authentication
The application uses Supabase for authentication with email verification.

**Base URL**: `https://your-project.supabase.co`

**Authentication Flow**:
1. User signs up with email
2. Email verification sent
3. User verifies email
4. User can sign in

### Environment Variables
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 📊 Meetups API

### Get Meetups
**Endpoint**: `GET /api/meetups`

**Headers**:
```
Authorization: Bearer <supabase_token>
```

**Response**:
```json
{
  "meetups": [
    {
      "id": "uuid",
      "token": "invite_token",
      "organizerName": "John Doe",
      "organizerEmail": "john@example.com",
      "status": "pending",
      "createdAt": "2025-01-01T00:00:00Z",
      "expiresAt": "2025-01-08T00:00:00Z",
      "cafe": {
        "id": "uuid",
        "name": "Coffee Shop",
        "address": "123 Main St",
        "latitude": 52.3676,
        "longitude": 4.9041
      },
      "availableDates": ["2025-01-15", "2025-01-16"],
      "availableTimes": ["09:00", "10:00"],
      "chosenDate": "2025-01-15",
      "inviteeName": "Jane Smith",
      "inviteeEmail": "jane@example.com"
    }
  ]
}
```

### Create Meetup
**Endpoint**: `POST /api/meetups`

**Headers**:
```
Authorization: Bearer <supabase_token>
Content-Type: application/json
```

**Body**:
```json
{
  "organizerName": "John Doe",
  "organizerEmail": "john@example.com",
  "selectedCity": "Amsterdam",
  "availableDates": ["2025-01-15", "2025-01-16"],
  "availableTimes": ["09:00", "10:00"],
  "dateTimePreferences": {
    "2025-01-15": ["09:00", "10:00"],
    "2025-01-16": ["14:00", "15:00"]
  },
  "priceRange": "medium",
  "cafeChoice": "random",
  "selectedCafeId": "uuid"
}
```

**Response**:
```json
{
  "success": true,
  "meetup": {
    "id": "uuid",
    "token": "invite_token",
    "inviteLink": "https://anemi-meets.com/invite/token"
  }
}
```

### Update Meetup
**Endpoint**: `PUT /api/meetups/[id]`

**Headers**:
```
Authorization: Bearer <supabase_token>
Content-Type: application/json
```

**Body**:
```json
{
  "organizerName": "John Doe",
  "availableDates": ["2025-01-15", "2025-01-16"],
  "availableTimes": ["09:00", "10:00"],
  "selectedCafeId": "uuid"
}
```

**Response**:
```json
{
  "success": true,
  "meetup": {
    "id": "uuid",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
}
```

### Delete Meetup
**Endpoint**: `DELETE /api/meetups/[id]`

**Headers**:
```
Authorization: Bearer <supabase_token>
```

**Response**:
```json
{
  "success": true
}
```

### Notify Changes
**Endpoint**: `POST /api/meetups/[id]/notify-changes`

**Headers**:
```
Authorization: Bearer <supabase_token>
Content-Type: application/json
```

**Body**:
```json
{
  "changes": {
    "date": "2025-01-15",
    "time": "10:00",
    "location": "New Coffee Shop"
  }
}
```

**Response**:
```json
{
  "success": true,
  "emailSent": true
}
```

## ☕ Cafes API

### Get Cafes
**Endpoint**: `GET /api/cafes`

**Query Parameters**:
- `city` (required): City name (e.g., "Amsterdam", "Rotterdam")
- `random` (optional): "true" to get a random cafe

**Example**:
```
GET /api/cafes?city=Amsterdam
GET /api/cafes?city=Rotterdam&random=true
```

**Response**:
```json
{
  "cafes": [
    {
      "id": "uuid",
      "name": "Coffee Shop",
      "description": "Cozy coffee shop in the city center",
      "city": "Amsterdam",
      "address": "123 Main St",
      "latitude": 52.3676,
      "longitude": 4.9041,
      "phone": "+31 20 123 4567",
      "website": "https://coffeeshop.com",
      "rating": 4.5,
      "reviewCount": 150,
      "priceRange": "medium",
      "features": ["wifi", "outdoor_seating"],
      "hours": {
        "monday": "08:00-18:00",
        "tuesday": "08:00-18:00"
      },
      "isVerified": true,
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-01T00:00:00Z"
    }
  ],
  "count": 1,
  "city": "Amsterdam",
  "debug": {
    "totalFound": 1,
    "withCoordinates": 1,
    "averageRating": 4.5
  }
}
```

### Shuffle Cafe
**Endpoint**: `GET /api/shuffle-cafe`

**Query Parameters**:
- `city` (required): City name

**Example**:
```
GET /api/shuffle-cafe?city=Amsterdam
```

**Response**:
```json
{
  "cafe": {
    "id": "uuid",
    "name": "Random Coffee Shop",
    "address": "456 Side St",
    "latitude": 52.3676,
    "longitude": 4.9041,
    "rating": 4.2,
    "priceRange": "low"
  }
}
```

## 📧 Email API

### Send Invite
**Endpoint**: `POST /api/send-invite`

**Headers**:
```
Content-Type: application/json
```

**Body**:
```json
{
  "to": "jane@example.com",
  "cafe": {
    "name": "Coffee Shop",
    "address": "123 Main St",
    "priceRange": "medium",
    "rating": 4.5,
    "openHours": "08:00-18:00"
  },
  "dates": ["2025-01-15", "2025-01-16"],
  "times": ["09:00", "10:00"],
  "token": "invite_token",
  "inviteLink": "https://anemi-meets.com/invite/token",
  "organizerName": "John Doe"
}
```

**Response**:
```json
{
  "success": true,
  "emailId": "email_id"
}
```

### Generate Invite
**Endpoint**: `POST /api/generate-invite`

**Headers**:
```
Authorization: Bearer <supabase_token>
Content-Type: application/json
```

**Body**:
```json
{
  "meetupId": "uuid",
  "inviteeEmail": "jane@example.com",
  "inviteeName": "Jane Smith"
}
```

**Response**:
```json
{
  "success": true,
  "invite": {
    "token": "invite_token",
    "inviteLink": "https://anemi-meets.com/invite/token"
  }
}
```

## 🔗 Invite API

### Get Invite
**Endpoint**: `GET /api/invite/[token]`

**Example**:
```
GET /api/invite/abc123def456
```

**Response**:
```json
{
  "invite": {
    "id": "uuid",
    "token": "abc123def456",
    "organizerName": "John Doe",
    "organizerEmail": "john@example.com",
    "status": "pending",
    "expiresAt": "2025-01-08T00:00:00Z",
    "cafe": {
      "name": "Coffee Shop",
      "address": "123 Main St"
    },
    "availableDates": ["2025-01-15", "2025-01-16"],
    "availableTimes": ["09:00", "10:00"],
    "inviteeName": "Jane Smith",
    "inviteeEmail": "jane@example.com"
  }
}
```

### Confirm Invite
**Endpoint**: `POST /api/invite/[token]/confirm`

**Headers**:
```
Content-Type: application/json
```

**Body**:
```json
{
  "chosenDate": "2025-01-15",
  "chosenTime": "10:00",
  "inviteeName": "Jane Smith",
  "inviteeEmail": "jane@example.com"
}
```

**Response**:
```json
{
  "success": true,
  "meetup": {
    "id": "uuid",
    "status": "confirmed",
    "chosenDate": "2025-01-15",
    "chosenTime": "10:00"
  }
}
```

### Accept Invite
**Endpoint**: `POST /api/invite/[token]/accept`

**Headers**:
```
Content-Type: application/json
```

**Body**:
```json
{
  "inviteeName": "Jane Smith",
  "inviteeEmail": "jane@example.com"
}
```

**Response**:
```json
{
  "success": true,
  "meetup": {
    "id": "uuid",
    "status": "accepted"
  }
}
```

### Decline Invite
**Endpoint**: `POST /api/invite/[token]/decline`

**Headers**:
```
Content-Type: application/json
```

**Body**:
```json
{
  "reason": "Not available at that time"
}
```

**Response**:
```json
{
  "success": true,
  "meetup": {
    "id": "uuid",
    "status": "declined"
  }
}
```

## 🔐 Auth API

### Create User
**Endpoint**: `POST /api/auth/create-user`

**Headers**:
```
Content-Type: application/json
```

**Body**:
```json
{
  "email": "john@example.com",
  "password": "secure_password"
}
```

**Response**:
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "john@example.com"
  }
}
```

### Manual Confirm
**Endpoint**: `POST /api/auth/manual-confirm`

**Headers**:
```
Content-Type: application/json
```

**Body**:
```json
{
  "email": "john@example.com"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Email confirmed manually"
}
```

### Confirm Email
**Endpoint**: `POST /api/auth/confirm-email`

**Headers**:
```
Content-Type: application/json
```

**Body**:
```json
{
  "email": "john@example.com"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Email confirmed"
}
```

## 🏥 Health API

### Health Check
**Endpoint**: `GET /api/health`

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-01T00:00:00Z",
  "version": "1.0.0",
  "environment": "production"
}
```

## 🐛 Debug API

### Debug Vercel
**Endpoint**: `GET /api/debug-vercel`

**Response**:
```json
{
  "environment": {
    "NODE_ENV": "production",
    "VERCEL_URL": "anemi-meets.vercel.app",
    "VERCEL_ENV": "production"
  },
  "database": {
    "connected": true,
    "tables": ["meetup_invites", "coffee_shops"]
  },
  "email": {
    "configured": true,
    "provider": "resend"
  }
}
```

### Debug SMTP
**Endpoint**: `GET /api/debug-smtp`

**Response**:
```json
{
  "smtp": {
    "configured": true,
    "provider": "resend",
    "from": "noreply@anemi-meets.com"
  },
  "test": {
    "success": true,
    "message": "Test email sent successfully"
  }
}
```

## 📊 Error Responses

### Standard Error Format
```json
{
  "error": "Error message",
  "details": "Additional error details",
  "code": "ERROR_CODE"
}
```

### Common Error Codes
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

### Validation Errors
```json
{
  "error": "Validation failed",
  "details": {
    "email": "Invalid email format",
    "city": "City is required"
  },
  "code": "VALIDATION_ERROR"
}
```

## 🔒 Security

### Authentication
- All protected endpoints require Supabase JWT token
- Tokens are validated on each request
- Expired tokens return 401 Unauthorized

### Rate Limiting
- API endpoints are rate limited
- Default: 100 requests per minute per IP
- Exceeded limits return 429 Too Many Requests

### CORS
- CORS is configured for production domains
- Development allows localhost
- Preflight requests are handled automatically

### Input Validation
- All inputs are validated and sanitized
- SQL injection protection via Prisma
- XSS protection via input sanitization

## 📝 Usage Examples

### JavaScript/TypeScript
```typescript
// Get cafes
const response = await fetch('/api/cafes?city=Amsterdam', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const cafes = await response.json();

// Create meetup
const meetupResponse = await fetch('/api/meetups', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    organizerName: 'John Doe',
    organizerEmail: 'john@example.com',
    selectedCity: 'Amsterdam',
    availableDates: ['2025-01-15'],
    availableTimes: ['10:00']
  })
});
const meetup = await meetupResponse.json();
```

### cURL
```bash
# Get cafes
curl -H "Authorization: Bearer $TOKEN" \
  "https://anemi-meets.com/api/cafes?city=Amsterdam"

# Create meetup
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "organizerName": "John Doe",
    "organizerEmail": "john@example.com",
    "selectedCity": "Amsterdam",
    "availableDates": ["2025-01-15"],
    "availableTimes": ["10:00"]
  }' \
  "https://anemi-meets.com/api/meetups"
```

## 📊 Response Codes

### Success Codes
- `200` - OK (GET, PUT, DELETE)
- `201` - Created (POST)

### Error Codes
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `429` - Too Many Requests
- `500` - Internal Server Error

## 🔄 Webhooks (Future)

### Meetup Confirmed
```json
{
  "event": "meetup.confirmed",
  "data": {
    "meetupId": "uuid",
    "organizerEmail": "john@example.com",
    "inviteeEmail": "jane@example.com",
    "chosenDate": "2025-01-15",
    "chosenTime": "10:00"
  }
}
```

### Meetup Cancelled
```json
{
  "event": "meetup.cancelled",
  "data": {
    "meetupId": "uuid",
    "reason": "Not available"
  }
}
```

---

**Last Updated**: January 2025
**Version**: 1.0.0 