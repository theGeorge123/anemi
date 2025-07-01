import { PrismaClient, PriceRange } from '@prisma/client';

const prisma = new PrismaClient();

const cafes = [
  // Amsterdam
  {
    name: 'Coffeecompany',
    city: 'Amsterdam',
    address: 'Utrechtsestraat 39, Amsterdam',
    latitude: 52.366,
    longitude: 4.898,
    description: 'Specialty coffee with a focus on quality beans and brewing methods.',
    features: ['wifi', 'outdoor seating', 'pet friendly'],
    priceRange: PriceRange.MODERATE,
    isVerified: true,
    photos: [
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=600&fit=crop'
    ],
  },
  {
    name: 'Back to Black',
    city: 'Amsterdam',
    address: 'Weteringstraat 48, Amsterdam',
    latitude: 52.360,
    longitude: 4.892,
    description: 'Cozy café with great coffee and homemade cakes.',
    features: ['wifi', 'vegan options'],
    priceRange: PriceRange.BUDGET,
    isVerified: true,
    photos: [
      'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop'
    ],
  },
  {
    name: 'Lot Sixty One',
    city: 'Amsterdam',
    address: 'Kinkerstraat 112, Amsterdam',
    latitude: 52.365,
    longitude: 4.875,
    description: 'Artisan coffee roasters with a passion for quality.',
    features: ['wifi', 'parking', 'outdoor seating'],
    priceRange: PriceRange.MODERATE,
    isVerified: true,
    photos: [
      'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&h=600&fit=crop'
    ],
  },
  {
    name: 'White Label Coffee',
    city: 'Amsterdam',
    address: 'Jan Evertsenstraat 136, Amsterdam',
    latitude: 52.368,
    longitude: 4.870,
    description: 'Minimalist coffee bar with expertly crafted drinks.',
    features: ['wifi', 'pet friendly'],
    priceRange: PriceRange.EXPENSIVE,
    isVerified: true,
    photos: [
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800&h=600&fit=crop'
    ],
  },
  {
    name: 'Toki',
    city: 'Amsterdam',
    address: 'Binnen Dommersstraat 15, Amsterdam',
    latitude: 52.367,
    longitude: 4.895,
    description: 'Japanese-inspired café with great coffee and food.',
    features: ['wifi', 'outdoor seating'],
    priceRange: PriceRange.BUDGET,
    isVerified: true,
    photos: [
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop'
    ],
  },

  // Rotterdam
  {
    name: 'Man Met Bril Koffie',
    city: 'Rotterdam',
    address: 'Vijverhofstraat 70, Rotterdam',
    latitude: 51.927,
    longitude: 4.468,
    description: 'Local favorite with excellent coffee and friendly atmosphere.',
    features: ['wifi', 'outdoor seating', 'pet friendly'],
    priceRange: PriceRange.BUDGET,
    isVerified: true,
    photos: [
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=600&fit=crop'
    ],
  },
  {
    name: 'Gulden Koffie',
    city: 'Rotterdam',
    address: 'Goudsesingel 212, Rotterdam',
    latitude: 51.925,
    longitude: 4.490,
    description: 'Modern café with a focus on specialty coffee.',
    features: ['wifi', 'vegan options', 'pet friendly'],
    priceRange: PriceRange.MODERATE,
    isVerified: true,
    photos: [
      'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop'
    ],
  },
  {
    name: 'Hopper Coffee',
    city: 'Rotterdam',
    address: 'Hoogstraat 76, Rotterdam',
    latitude: 51.922,
    longitude: 4.485,
    description: 'Artisan coffee shop in the heart of Rotterdam.',
    features: ['wifi', 'parking'],
    priceRange: PriceRange.EXPENSIVE,
    isVerified: true,
    photos: [
      'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&h=600&fit=crop'
    ],
  },
  {
    name: 'Urban Espresso Bar',
    city: 'Rotterdam',
    address: 'Coolsingel 105, Rotterdam',
    latitude: 51.920,
    longitude: 4.480,
    description: 'Urban coffee bar with a modern vibe.',
    features: ['wifi', 'outdoor seating', 'parking'],
    priceRange: PriceRange.MODERATE,
    isVerified: true,
    photos: [
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800&h=600&fit=crop'
    ],
  },
  {
    name: 'Coffee & Coconuts',
    city: 'Rotterdam',
    address: 'Hoogstraat 85, Rotterdam',
    latitude: 51.921,
    longitude: 4.482,
    description: 'Healthy coffee spot with great vibes.',
    features: ['wifi', 'vegan options'],
    priceRange: PriceRange.BUDGET,
    isVerified: true,
    photos: [
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop'
    ],
  },
];

async function main() {
  // Clear existing data
  await prisma.coffeeShop.deleteMany({});
  
  // Create new cafes
  for (const cafe of cafes) {
    await prisma.coffeeShop.create({ data: cafe });
  }
  console.log('🌱 Seeded 10 coffee shops in Amsterdam & Rotterdam!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 