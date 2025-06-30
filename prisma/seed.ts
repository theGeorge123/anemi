import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const cafes = [
  {
    name: 'Brewed Awakening',
    address: '123 Main St, Springfield',
    latitude: 40.7128,
    longitude: -74.0060,
    description: 'A cozy spot for espresso and pastries.',
    features: ['wifi', 'outdoor seating', 'pet friendly'],
    priceRange: 'MODERATE',
    isVerified: true,
  },
  {
    name: 'The Daily Grind',
    address: '456 Elm St, Springfield',
    latitude: 40.7138,
    longitude: -74.0050,
    description: 'Locally roasted beans and friendly baristas.',
    features: ['wifi', 'vegan options'],
    priceRange: 'CHEAP',
    isVerified: true,
  },
  {
    name: 'Java Junction',
    address: '789 Oak Ave, Springfield',
    latitude: 40.7148,
    longitude: -74.0040,
    description: 'Perfect for remote work and meetings.',
    features: ['wifi', 'parking', 'outdoor seating'],
    priceRange: 'MODERATE',
    isVerified: true,
  },
  {
    name: 'Caffeine Fix',
    address: '321 Maple Rd, Springfield',
    latitude: 40.7158,
    longitude: -74.0030,
    description: 'Specialty lattes and cold brew.',
    features: ['wifi', 'pet friendly'],
    priceRange: 'EXPENSIVE',
    isVerified: true,
  },
  {
    name: 'Bean There',
    address: '654 Pine St, Springfield',
    latitude: 40.7168,
    longitude: -74.0020,
    description: 'Chill vibes and great playlists.',
    features: ['wifi', 'outdoor seating'],
    priceRange: 'CHEAP',
    isVerified: true,
  },
  {
    name: 'Perk Up Café',
    address: '987 Cedar Ave, Springfield',
    latitude: 40.7178,
    longitude: -74.0010,
    description: 'Latte art and homemade cakes.',
    features: ['wifi', 'vegan options', 'pet friendly'],
    priceRange: 'MODERATE',
    isVerified: true,
  },
  {
    name: 'Steamy Beans',
    address: '159 Walnut St, Springfield',
    latitude: 40.7188,
    longitude: -74.0000,
    description: 'Open late for night owls.',
    features: ['wifi', 'parking'],
    priceRange: 'EXPENSIVE',
    isVerified: true,
  },
  {
    name: 'Grounds for Celebration',
    address: '753 Birch Blvd, Springfield',
    latitude: 40.7198,
    longitude: -73.9990,
    description: 'Great for group meetups.',
    features: ['wifi', 'outdoor seating', 'parking'],
    priceRange: 'MODERATE',
    isVerified: true,
  },
  {
    name: 'Espresso Yourself',
    address: '852 Willow Way, Springfield',
    latitude: 40.7208,
    longitude: -73.9980,
    description: 'Creative drinks and local art.',
    features: ['wifi', 'vegan options'],
    priceRange: 'CHEAP',
    isVerified: true,
  },
  {
    name: 'Mocha Moments',
    address: '951 Poplar Pl, Springfield',
    latitude: 40.7218,
    longitude: -73.9970,
    description: 'Family-friendly and spacious.',
    features: ['wifi', 'outdoor seating', 'pet friendly'],
    priceRange: 'MODERATE',
    isVerified: true,
  },
];

async function main() {
  for (const cafe of cafes) {
    await prisma.coffeeShop.create({ data: cafe });
  }
  console.log('🌱 Seeded 10 coffee shops!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 