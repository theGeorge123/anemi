# Security and Performance Improvements

## 🔐 Row-Level Security (RLS)

### Overview
Row-Level Security has been implemented to ensure users can only access data they're authorized to view or modify.

### RLS Policies Implemented

#### CoffeeShop Model
```sql
-- Public read access, owner write access
CREATE POLICY "read_public" ON "CoffeeShop" FOR SELECT USING (true);
CREATE POLICY "write_own" ON "CoffeeShop" FOR ALL USING (auth.uid()::text = "createdBy");
```

#### Meetup Model
```sql
-- Read access for public meetups or participants
CREATE POLICY "read_public_meetups" ON "Meetup" FOR SELECT USING (
  "isPrivate" = false OR 
  auth.uid()::text = "createdBy" OR
  EXISTS (
    SELECT 1 FROM "Participant" 
    WHERE "meetupId" = "Meetup".id AND "userId" = auth.uid()::text
  )
);
-- Write access for meetup creators
CREATE POLICY "write_own_meetups" ON "Meetup" FOR ALL USING (auth.uid()::text = "createdBy");
```

### Usage Notes
- RLS policies are defined in `prisma/migrations/001_rls_policies.sql`
- Policies use `auth.uid()` for Supabase authentication
- All user-generated content is protected by ownership policies

## 🗑️ Soft Delete Implementation

### Overview
Meetups now use soft deletes to preserve history while hiding cancelled events.

### Implementation Details

#### Database Schema
```prisma
model Meetup {
  // ... other fields
  deletedAt   DateTime? // Soft delete for cancelled events
  // ... other fields
}
```

#### Utility Functions
- `softDeleteMeetup()` - Mark meetup as deleted
- `restoreMeetup()` - Restore soft-deleted meetup
- `getActiveMeetups()` - Query only active meetups
- `permanentlyDeleteOldMeetups()` - Clean up old soft-deleted records

### Benefits
- Preserves meetup history and analytics
- Allows meetup restoration if needed
- Maintains referential integrity
- Enables audit trails

## ⚡ Performance Optimizations

### Location-Based Queries

#### Spatial Indexes
```sql
-- PostGIS spatial index for lightning-fast location queries
CREATE INDEX idx_coffeeshop_location ON "CoffeeShop" USING GIST (ST_SetSRID(ST_MakePoint(longitude, latitude), 4326));

-- Composite index for meetup location queries with soft delete filter
CREATE INDEX idx_meetup_active_location ON "Meetup" (latitude, longitude) WHERE "deletedAt" IS NULL;
```

#### Optimized Query Strategy
1. **Bounding Box Filter** - Use spatial index for initial filtering
2. **Precise Distance Calculation** - Apply exact distance filtering
3. **Sort by Distance** - Return results ordered by proximity

### Database Indexes

#### CoffeeShop Indexes
```prisma
@@index([latitude, longitude]) // Consider PostGIS GIN index for "cafés near me" queries
@@index([rating])
@@index([priceRange])
```

#### Meetup Indexes
```prisma
@@index([date])
@@index([status])
@@index([createdBy])
@@index([venueType])
@@index([category])
@@index([deletedAt]) // Index for soft delete queries
```

## 🛡️ Security Guidelines

### API Key Management
- **R05**: API keys live in `.env.local` and Vercel dashboard; never in code
- Use environment variables for all sensitive configuration
- Rotate keys regularly
- Use different keys for development and production

### Input Validation
- Validate all user inputs
- Sanitize data before database operations
- Use parameterized queries to prevent SQL injection
- Implement rate limiting for API endpoints

## 📊 Performance Monitoring

### Query Optimization
- Monitor slow queries using database logs
- Use query analysis tools to identify bottlenecks
- Implement caching for frequently accessed data
- Use database connection pooling

## 🧪 Testing Requirements

### Test Coverage
- **R04**: `npm run test` coverage ≥ 30% MVP; raise to 80% after launch
- Write unit tests for all utility functions
- Include integration tests for database operations
- Test RLS policies with different user contexts

## 📝 Build Rules

### Code Organization
- **R01**: Every new component goes in `src/components/*`
- **R02**: No function > 50 lines; split into helpers
- **R03**: Stylelint must reject hard-coded hex colors (#123abc); use design tokens

### Database Rules
- **R06**: Use Row-Level Security (RLS) policies for all user data models
- **R07**: Implement soft deletes for user-generated content (deletedAt field)
- **R08**: Use PostGIS GIN indexes for location-based queries when possible

## 🚀 Deployment Considerations

### Environment Setup
1. Enable RLS on all tables
2. Apply RLS policies via migration
3. Set up PostGIS extension (if using spatial queries)
4. Configure proper environment variables
5. Set up monitoring and alerting

### Database Migration
```bash
# Apply RLS policies
psql -d your_database -f prisma/migrations/001_rls_policies.sql

# Enable PostGIS (if needed)
psql -d your_database -c "CREATE EXTENSION IF NOT EXISTS postgis;"
``` 