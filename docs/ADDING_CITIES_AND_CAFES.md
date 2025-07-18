# Adding Cities and Cafes

This guide explains how to add new cities and cafes to the Anemi app.

## Adding a New City

### 1. Update the Cities Constants

Edit `src/constants/cities.ts`:

```typescript
export const cities = ["Amsterdam", "Rotterdam", "Utrecht", "The Hague"] as const;
export type City = (typeof cities)[number];

export const cityMeta: Record<City, { emoji: string; tag: string }> = {
  Amsterdam: { emoji: "🚲", tag: "Canals & culture" },
  Rotterdam: { emoji: "⚓", tag: "Modern harbours" },
  Utrecht: { emoji: "🏰", tag: "Historic center" },
  "The Hague": { emoji: "👑", tag: "Royal city" },
};
```

### 2. Add Cafes for the New City

Edit `prisma/seed.ts` and add cafe objects to the `cafes` array:

```typescript
{
  name: 'Your Cafe Name',
  city: 'Utrecht', // Must match the city name exactly
  address: 'Street Address, Postal Code Utrecht',
  latitude: 52.0907, // Use actual coordinates
  longitude: 5.1214,
  description: 'Description of the cafe...',
  features: ['wifi', 'outdoor seating', 'pet friendly'],
  priceRange: PriceRange.MODERATE, // BUDGET, MODERATE, EXPENSIVE, LUXURY
  isVerified: true,
  phone: '+31 30 123 4567',
  website: 'https://yourcafe.com',
  rating: 4.5, // 0.0 to 5.0
  reviewCount: 123,
  hours: {
    mon: '8:00-18:00',
    tue: '8:00-18:00',
    wed: '8:00-18:00',
    thu: '8:00-18:00',
    fri: '8:00-18:00',
    sat: '9:00-18:00',
    sun: '9:00-18:00',
  },
  photos: [], // Add image URLs here if available
},
```

### 3. Run the Seed Script

```bash
npx prisma db seed
```

This will clear existing cafes and add all the new ones.

## Cafe Data Structure

Each cafe object should include:

- **name**: Cafe name
- **city**: Must match exactly with the cities array
- **address**: Full address
- **latitude/longitude**: GPS coordinates
- **description**: Brief description of the cafe
- **features**: Array of features like `['wifi', 'outdoor seating', 'pet friendly']`
- **priceRange**: One of `BUDGET`, `MODERATE`, `EXPENSIVE`, `LUXURY`
- **isVerified**: Set to `true` for verified cafes
- **phone**: Contact number
- **website**: Cafe website
- **rating**: Average rating (0.0 to 5.0)
- **reviewCount**: Number of reviews
- **hours**: Business hours for each day
- **photos**: Array of image URLs (can be empty)

## Features Available

Common features you can use:
- `wifi`
- `outdoor seating`
- `pet friendly`
- `indoor seating`
- `roasting on-site`
- `homemade cakes`
- `healthy food`
- `minimalist design`
- `scandinavian food`
- `breakfast menu`
- `laptop friendly`

## Price Ranges

- **BUDGET**: Affordable cafes
- **MODERATE**: Standard pricing
- **EXPENSIVE**: Premium cafes
- **LUXURY**: High-end experiences

## Testing

After adding cafes, test the API:

```bash
curl "http://localhost:3003/api/cafes?city=YourCity"
```

The cafe selection feature will automatically work for any city that has cafes in the database. 