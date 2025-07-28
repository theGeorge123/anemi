import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const rotterdamCafes = [
  {
    name: "Wakuli Specialty Coffee Bar",
    description: "Subscription-based specialty coffee roaster with a focus on direct-trade and sustainable beans. Features a cozy bar for tastings.",
    address: "Witte de Withstraat 44, Rotterdam",
    latitude: 51.9175,
    longitude: 4.4778,
    phone: "+31 10 307 2222",
    website: "https://wakuli.com",
    rating: 5.0,
    reviewCount: 150,
    priceRange: "BUDGET" as const, // €1–10
    features: ["Outdoor seating", "Vegan options", "Wi-Fi", "Laptop-friendly"],
    hours: {
      "Mon-Fri": "8AM-6PM",
      "Sat-Sun": "9AM-5PM"
    },
    photos: ["https://example.com/photo1.jpg", "https://example.com/photo2.jpg"],
    isVerified: true,
    city: "Rotterdam"
  },
  {
    name: "Ripsnorter Coffee Roasters",
    description: "Micro-roastery specializing in on-site roasting and single-origin brews. Hosts cupping events.",
    address: "Zaagmolenkade 15, Rotterdam",
    latitude: 51.9302,
    longitude: 4.4856,
    phone: "+31 10 123 4567",
    website: "https://ripsnortercoffee.com",
    rating: 4.9,
    reviewCount: 320,
    priceRange: "BUDGET" as const, // €1–10
    features: ["On-site roasting", "Cuppings", "Vegan options"],
    hours: {
      "Mon-Sat": "7AM-7PM",
      "Sun": "Closed"
    },
    photos: ["https://example.com/photo3.jpg", "https://example.com/photo4.jpg"],
    isVerified: true,
    city: "Rotterdam"
  },
  {
    name: "Perron Noord",
    description: "Community-oriented coffee spot with live events and a focus on local artists.",
    address: "Noorderplein 12, Rotterdam",
    latitude: 51.9350,
    longitude: 4.4800,
    phone: "+31 10 987 6543",
    website: "https://perronnoord.nl",
    rating: 4.9,
    reviewCount: 280,
    priceRange: "MODERATE" as const, // €1–20
    features: ["Live music", "Outdoor seating", "Wi-Fi"],
    hours: {
      "Tue-Sun": "9AM-10PM",
      "Mon": "Closed"
    },
    photos: ["https://example.com/photo5.jpg"],
    isVerified: true,
    city: "Rotterdam"
  },
  {
    name: "Bonza Koffie",
    description: "Neighborhood cafe with high-quality brews and community events like workshops.",
    address: "Zomerhofstraat 71, Rotterdam",
    latitude: 51.9280,
    longitude: 4.4825,
    phone: "+31 10 456 7890",
    website: "https://bonzakoffie.nl",
    rating: 4.9,
    reviewCount: 450,
    priceRange: "MODERATE" as const, // €1–20
    features: ["Events space", "Vegan options", "Kid-friendly"],
    hours: {
      "Mon-Fri": "8AM-5PM",
      "Sat": "9AM-4PM",
      "Sun": "Closed"
    },
    photos: ["https://example.com/photo6.jpg", "https://example.com/photo7.jpg"],
    isVerified: true,
    city: "Rotterdam"
  },
  {
    name: "Solo Espresso Bar",
    description: "Minimalist third-wave coffee bar emphasizing hand-brewed single origins.",
    address: "Kralingseweg 123, Rotterdam",
    latitude: 51.9220,
    longitude: 4.5100,
    phone: "+31 10 321 6549",
    website: "https://soloespresso.bar",
    rating: 4.9,
    reviewCount: 200,
    priceRange: "BUDGET" as const, // €1–10
    features: ["Hand-brews", "Wi-Fi", "Takeaway"],
    hours: {
      "Mon-Sat": "7:30AM-6PM",
      "Sun": "8AM-5PM"
    },
    photos: ["https://example.com/photo8.jpg"],
    isVerified: true,
    city: "Rotterdam"
  },
  {
    name: "Hopper Coffee",
    description: "Popular spot for specialty coffee and light bites in the city center.",
    address: "Schiedamse Vest 146, Rotterdam",
    latitude: 51.9160,
    longitude: 4.4790,
    phone: "+31 10 213 0990",
    website: "https://hoppercoffee.nl",
    rating: 4.3,
    reviewCount: 705,
    priceRange: "MODERATE" as const, // €10–20
    features: ["Brunch menu", "Outdoor seating", "Vegan options"],
    hours: {
      "Daily": "8AM-6PM"
    },
    photos: ["https://example.com/photo9.jpg", "https://example.com/photo10.jpg"],
    isVerified: true,
    city: "Rotterdam"
  },
  {
    name: "Urban Espresso Bar WEST",
    description: "Cozy espresso bar with a focus on quality brews and urban vibes.",
    address: "Nieuwe Binnenweg 263, Rotterdam",
    latitude: 51.9135,
    longitude: 4.4650,
    phone: "+31 10 436 0191",
    website: "https://urbanespressobar.nl",
    rating: 4.3,
    reviewCount: 455,
    priceRange: "BUDGET" as const, // €1–10
    features: ["Wi-Fi", "Laptop-friendly", "Takeaway"],
    hours: {
      "Mon-Fri": "7AM-7PM",
      "Sat-Sun": "8AM-6PM"
    },
    photos: ["https://example.com/photo11.jpg"],
    isVerified: true,
    city: "Rotterdam"
  },
  {
    name: "Man met Bril Koffie",
    description: "Micro-roastery with on-site roasting and a community feel.",
    address: "Vijverhofstraat 70, Rotterdam",
    latitude: 51.9290,
    longitude: 4.4870,
    phone: "+31 10 215 2134",
    website: "https://manmetbrilkoffie.nl",
    rating: 4.5,
    reviewCount: 600,
    priceRange: "BUDGET" as const, // €1–10
    features: ["On-site roasting", "Cuppings", "Events"],
    hours: {
      "Tue-Sun": "9AM-5PM",
      "Mon": "Closed"
    },
    photos: ["https://example.com/photo12.jpg", "https://example.com/photo13.jpg"],
    isVerified: true,
    city: "Rotterdam"
  },
  {
    name: "Juffrouw van Zanten",
    description: "Family-friendly cafe with play areas and kid menus, great for parents.",
    address: "Meent 88, Rotterdam",
    latitude: 51.9210,
    longitude: 4.4850,
    phone: "+31 10 215 2135",
    website: "https://juffrouwvanzanten.nl",
    rating: 4.1,
    reviewCount: 350,
    priceRange: "MODERATE" as const, // €10–20
    features: ["Kid-friendly", "Play area", "Brunch menu"],
    hours: {
      "Daily": "9AM-6PM"
    },
    photos: ["https://example.com/photo14.jpg"],
    isVerified: true,
    city: "Rotterdam"
  },
  {
    name: "Harvest Cafe & Bakery",
    description: "Bakery-focused cafe with extensive food menu and high review volume.",
    address: "Hoogstraat 129, Rotterdam",
    latitude: 51.9230,
    longitude: 4.4900,
    phone: "+31 10 433 5717",
    website: "https://harvestcafe.nl",
    rating: 4.6,
    reviewCount: 1830,
    priceRange: "MODERATE" as const, // €10–20
    features: ["Bakery items", "Brunch", "Vegan options"],
    hours: {
      "Daily": "8AM-8PM"
    },
    photos: ["https://example.com/photo15.jpg", "https://example.com/photo16.jpg"],
    isVerified: true,
    city: "Rotterdam"
  },
  {
    name: "Koekela",
    description: "Iconic bakery and coffee spot known for cakes and pastries.",
    address: "Nieuwe Binnenweg 79A, Rotterdam",
    latitude: 51.9140,
    longitude: 4.4700,
    phone: "+31 10 215 2139",
    website: "https://koekela.nl",
    rating: 4.7,
    reviewCount: 2316,
    priceRange: "MODERATE" as const, // €10–20
    features: ["Bakery", "Outdoor seating", "Takeaway"],
    hours: {
      "Mon-Sat": "8AM-6PM",
      "Sun": "9AM-5PM"
    },
    photos: ["https://example.com/photo17.jpg"],
    isVerified: true,
    city: "Rotterdam"
  },
  {
    name: "Cafecito",
    description: "Third-wave minimalist coffee bar with single-origin focus.",
    address: "Pannekkoekstraat 5, Rotterdam",
    latitude: 51.9180,
    longitude: 4.4800,
    phone: "+31 10 123 4568",
    website: "https://cafecito.nl",
    rating: 4.8,
    reviewCount: 250,
    priceRange: "BUDGET" as const, // €1–10
    features: ["Hand-brews", "Wi-Fi"],
    hours: {
      "Mon-Fri": "8AM-5PM",
      "Sat": "9AM-4PM",
      "Sun": "Closed"
    },
    photos: ["https://example.com/photo18.jpg"],
    isVerified: true,
    city: "Rotterdam"
  },
  {
    name: "Schot Coffee Roasters",
    description: "Micro-roastery emphasizing sustainable sourcing.",
    address: "Delftsestraat 10, Rotterdam",
    latitude: 51.9200,
    longitude: 4.4750,
    phone: "+31 10 987 6544",
    website: "https://schotcoffee.nl",
    rating: 4.7,
    reviewCount: 400,
    priceRange: "BUDGET" as const, // €1–10
    features: ["On-site roasting", "Vegan options"],
    hours: {
      "Tue-Sun": "9AM-6PM",
      "Mon": "Closed"
    },
    photos: ["https://example.com/photo19.jpg"],
    isVerified: true,
    city: "Rotterdam"
  },
  {
    name: "Grounded Coffee",
    description: "Minimalist spot for specialty coffee and light snacks.",
    address: "Bergweg 209, Rotterdam",
    latitude: 51.9320,
    longitude: 4.4900,
    phone: "+31 10 456 7891",
    website: "https://groundedcoffee.nl",
    rating: 4.6,
    reviewCount: 300,
    priceRange: "BUDGET" as const, // €1–10
    features: ["Wi-Fi", "Laptop-friendly", "Takeaway"],
    hours: {
      "Daily": "8AM-5PM"
    },
    photos: ["https://example.com/photo20.jpg"],
    isVerified: true,
    city: "Rotterdam"
  },
  {
    name: "30ml Coffee Roasters",
    description: "Brunch-oriented cafe with roasted beans and food pairings.",
    address: "Coolsingel 18, Rotterdam",
    latitude: 51.9190,
    longitude: 4.4780,
    phone: "+31 10 321 6550",
    website: "https://30ml.nl",
    rating: 4.4,
    reviewCount: 500,
    priceRange: "MODERATE" as const, // €10–20
    features: ["Brunch menu", "Outdoor seating"],
    hours: {
      "Daily": "9AM-7PM"
    },
    photos: ["https://example.com/photo21.jpg", "https://example.com/photo22.jpg"],
    isVerified: true,
    city: "Rotterdam"
  },
  {
    name: "Nice Coffee",
    description: "Community cafe with events and a welcoming atmosphere.",
    address: "Eendrachtsweg 52A, Rotterdam",
    latitude: 51.9150,
    longitude: 4.4720,
    phone: "+31 10 215 2140",
    website: "https://nicecoffee.nl",
    rating: 4.5,
    reviewCount: 220,
    priceRange: "MODERATE" as const, // €1–20
    features: ["Events space", "Live music"],
    hours: {
      "Wed-Sun": "10AM-10PM",
      "Mon-Tue": "Closed"
    },
    photos: ["https://example.com/photo23.jpg"],
    isVerified: true,
    city: "Rotterdam"
  },
  {
    name: "Âme Cafe",
    description: "Concept store cafe with coffee and local artisan products.",
    address: "Westewagenstraat 80, Rotterdam",
    latitude: 51.9170,
    longitude: 4.4810,
    phone: "+31 10 123 4569",
    website: "https://amecafe.nl",
    rating: 4.6,
    reviewCount: 180,
    priceRange: "MODERATE" as const, // €10–20
    features: ["Concept store", "Vegan options"],
    hours: {
      "Tue-Sat": "10AM-6PM",
      "Sun-Mon": "Closed"
    },
    photos: ["https://example.com/photo24.jpg"],
    isVerified: true,
    city: "Rotterdam"
  }
];

export async function POST(request: NextRequest) {
  try {
    console.log('🏪 Starting Rotterdam cafés seeding...');
    
    let addedCount = 0;
    let skippedCount = 0;
    const errors: string[] = [];

    for (const cafe of rotterdamCafes) {
      try {
        // Check if cafe already exists
        const existingCafe = await prisma.coffeeShop.findFirst({
          where: {
            name: cafe.name,
            city: cafe.city
          }
        });

        if (existingCafe) {
          console.log(`⚠️  Café "${cafe.name}" already exists, skipping...`);
          skippedCount++;
          continue;
        }

        // Create new cafe
        const createdCafe = await prisma.coffeeShop.create({
          data: cafe
        });

        console.log(`✅ Added: ${createdCafe.name}`);
        addedCount++;

      } catch (error) {
        const errorMsg = `Failed to add ${cafe.name}: ${error}`;
        console.error(errorMsg);
        errors.push(errorMsg);
      }
    }

    // Get final count
    const totalCafes = await prisma.coffeeShop.count({
      where: { city: 'Rotterdam' }
    });

    return NextResponse.json({
      success: true,
      message: 'Rotterdam cafés seeding completed',
      stats: {
        added: addedCount,
        skipped: skippedCount,
        errors: errors.length,
        totalRotterdamCafes: totalCafes
      },
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('❌ Error seeding Rotterdam cafés:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to seed Rotterdam cafés', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Return info about the seeding data without actually seeding
    return NextResponse.json({
      message: 'Rotterdam cafés seeding endpoint',
      availableCafes: rotterdamCafes.length,
      cafes: rotterdamCafes.map(cafe => ({
        name: cafe.name,
        address: cafe.address,
        rating: cafe.rating,
        priceRange: cafe.priceRange,
        features: cafe.features
      })),
      instructions: 'Send a POST request to this endpoint to seed the database with Rotterdam cafés'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get cafe data' },
      { status: 500 }
    );
  }
}