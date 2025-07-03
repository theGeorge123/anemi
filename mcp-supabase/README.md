# Supabase MCP Server

A Model Context Protocol (MCP) server for interacting with Supabase databases. This server provides tools for managing coffee shops, meetup invites, users, and general database operations.

## Features

- **Coffee Shop Management**: CRUD operations for coffee shops with filtering by city and price range
- **Meetup Invite System**: Create, manage, and confirm meetup invites
- **User Management**: Basic user operations
- **Database Operations**: Execute SQL queries, get table information, and count records
- **Type Safety**: Full TypeScript support with Zod validation

## Installation

1. Clone or navigate to the mcp-supabase directory:
```bash
cd mcp-supabase
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment example and configure your Supabase credentials:
```bash
cp env.example .env
```

4. Edit `.env` with your Supabase project details:
```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

### Watch Mode
```bash
npm run watch
```

## Available Tools

### Coffee Shop Tools

#### `get_coffee_shops`
Get coffee shops with optional filtering.
```json
{
  "city": "Amsterdam",
  "priceRange": "MODERATE"
}
```

#### `get_coffee_shop_by_id`
Get a specific coffee shop by ID.
```json
{
  "id": "coffee-shop-id"
}
```

#### `create_coffee_shop`
Create a new coffee shop.
```json
{
  "name": "Coffee Corner",
  "description": "A cozy coffee shop",
  "city": "Amsterdam",
  "address": "123 Coffee Street",
  "latitude": 52.3676,
  "longitude": 4.9041,
  "priceRange": "MODERATE",
  "features": ["wifi", "outdoor_seating"],
  "photos": ["https://example.com/photo1.jpg"]
}
```

#### `update_coffee_shop`
Update an existing coffee shop.
```json
{
  "id": "coffee-shop-id",
  "updates": {
    "rating": 4.5,
    "reviewCount": 100
  }
}
```

#### `delete_coffee_shop`
Soft delete a coffee shop.
```json
{
  "id": "coffee-shop-id"
}
```

### Meetup Invite Tools

#### `get_meetup_invites`
Get meetup invites with optional status filtering.
```json
{
  "status": "pending"
}
```

#### `get_meetup_invite_by_token`
Get a specific meetup invite by token.
```json
{
  "token": "invite-token"
}
```

#### `create_meetup_invite`
Create a new meetup invite.
```json
{
  "token": "unique-token",
  "organizerName": "John Doe",
  "organizerEmail": "john@example.com",
  "cafeId": "cafe-id",
  "availableDates": ["2024-01-15", "2024-01-16"],
  "availableTimes": ["14:00", "15:00"],
  "expiresAt": "2024-01-20T00:00:00Z"
}
```

#### `confirm_meetup_invite`
Confirm a meetup invite with invitee details.
```json
{
  "token": "invite-token",
  "inviteeName": "Jane Smith",
  "inviteeEmail": "jane@example.com",
  "chosenDate": "2024-01-15",
  "chosenTime": "14:00"
}
```

### User Tools

#### `get_users`
Get all users.
```json
{}
```

#### `get_user_by_id`
Get a specific user by ID.
```json
{
  "id": "user-id"
}
```

#### `create_user`
Create a new user.
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "image": "https://example.com/avatar.jpg"
}
```

### Database Tools

#### `execute_sql`
Execute raw SQL query.
```json
{
  "sql": "SELECT * FROM \"CoffeeShop\" WHERE city = $1",
  "params": ["Amsterdam"]
}
```

#### `get_table_info`
Get table schema information.
```json
{
  "tableName": "CoffeeShop"
}
```

#### `get_table_count`
Get row count for a table.
```json
{
  "tableName": "CoffeeShop"
}
```

## Database Schema

The MCP server expects the following tables in your Supabase database:

### CoffeeShop
- `id` (string, primary key)
- `name` (string)
- `description` (string, nullable)
- `city` (string)
- `address` (string)
- `latitude` (number)
- `longitude` (number)
- `phone` (string, nullable)
- `website` (string, nullable)
- `rating` (number)
- `reviewCount` (number)
- `priceRange` (enum: BUDGET, MODERATE, EXPENSIVE, LUXURY)
- `features` (string array)
- `hours` (json, nullable)
- `photos` (string array)
- `isVerified` (boolean)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)
- `deletedAt` (timestamp, nullable)

### MeetupInvite
- `id` (string, primary key)
- `token` (string, unique)
- `organizerName` (string)
- `organizerEmail` (string)
- `inviteeName` (string, nullable)
- `inviteeEmail` (string, nullable)
- `cafeId` (string, foreign key)
- `availableDates` (string array)
- `availableTimes` (string array)
- `chosenDate` (string, nullable)
- `chosenTime` (string, nullable)
- `status` (string)
- `expiresAt` (timestamp)
- `confirmedAt` (timestamp, nullable)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)
- `deletedAt` (timestamp, nullable)

### User
- `id` (string, primary key)
- `name` (string, nullable)
- `email` (string, nullable, unique)
- `emailVerified` (timestamp, nullable)
- `image` (string, nullable)
- `password` (string, nullable)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

## Error Handling

The MCP server provides detailed error messages for:
- Database connection issues
- Invalid input data
- Missing required fields
- SQL execution errors
- Record not found errors

## Security

- Uses Supabase Row Level Security (RLS) policies
- Supports both anonymous and service role keys
- Input validation with Zod schemas
- SQL injection protection through parameterized queries

## Development

### Adding New Tools

1. Define the tool in the `setupToolHandlers` method
2. Add the corresponding method to `SupabaseMCPClient`
3. Handle the tool call in the switch statement
4. Add TypeScript types if needed

### Testing

```bash
# Test the server
npm run dev

# In another terminal, test with MCP client
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}' | npm start
```

## License

MIT License - see LICENSE file for details. 