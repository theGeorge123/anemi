import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const allCityCafes = [
  // RHOON (NEW CITY)
  {
    name: "ThéCafé Rhoon",
    description: "Lunchroom + chocolaterie met 90 theesoorten, huisgemaakte high-tea's en Leonidas-bonbons; gratis parkeren in het dorpscentrum.",
    address: "Dorpsstraat 10, Rhoon",
    latitude: 51.8547,
    longitude: 4.4623,
    phone: "+31 10 456 7891",
    website: "https://thecaferhoon.nl",
    rating: 4.5,
    reviewCount: 210,
    priceRange: "MODERATE" as const, // €10–20
    features: ["Outdoor seating", "Wi-Fi", "Vegan options", "Family-friendly", "Free parking"],
    hours: {
      "Mon-Sun": "9AM-6PM"
    },
    photos: ["https://example.com/photo_rhoon1.jpg"],
    isVerified: true,
    city: "Rhoon"
  },
  {
    name: "Brasserie Het Wapen van Rhoon",
    description: "Historische herberg uit 1625 met koffie, gebak, lunch, diner en groot dorpsterras; kindvriendelijk, vegan opties en gratis parkeren.",
    address: "Dorpsstraat 15, Rhoon",
    latitude: 51.8549,
    longitude: 4.4629,
    phone: "+31 10 456 7892",
    website: "https://hetwapenvanrhoon.nl",
    rating: 4.4,
    reviewCount: 180,
    priceRange: "MODERATE" as const, // €10–20
    features: ["Outdoor seating", "Vegan options", "Kid-friendly", "Free parking"],
    hours: {
      "Mon-Sun": "10AM-10PM"
    },
    photos: ["https://example.com/photo_rhoon2.jpg"],
    isVerified: true,
    city: "Rhoon"
  },

  // UTRECHT (NEW CITY)
  {
    name: "StartHub Cafe",
    description: "Coffeebar + meeting-hub bij Vredenburg; communityfocus en vegan brunch.",
    address: "Vredenburg 10, Utrecht",
    latitude: 52.0907,
    longitude: 5.1214,
    phone: "+31 30 123 4567",
    website: "https://starthubcafe.nl",
    rating: 4.6,
    reviewCount: 310,
    priceRange: "BUDGET" as const, // €1–10
    features: ["Wi-Fi", "Vegan options", "Laptop-friendly", "Events"],
    hours: {
      "Mon-Fri": "8AM-6PM",
      "Sat-Sun": "9AM-5PM"
    },
    photos: ["https://example.com/photo_utrecht1.jpg"],
    isVerified: true,
    city: "Utrecht"
  },
  {
    name: "Darras Coffee Roasters",
    description: "Microbranderij en café; focust op slow coffee en trendysfeer; voor liefhebbers.",
    address: "Bakkerstraat 12, Utrecht",
    latitude: 52.0925,
    longitude: 5.1209,
    phone: "+31 30 765 4321",
    website: "https://darrascoffee.nl",
    rating: 4.7,
    reviewCount: 290,
    priceRange: "BUDGET" as const, // €1–10
    features: ["On-site roasting", "Vegan options", "Wi-Fi", "Events"],
    hours: {
      "Tue-Sun": "9AM-6PM",
      "Mon": "Closed"
    },
    photos: ["https://example.com/photo_utrecht2.jpg"],
    isVerified: true,
    city: "Utrecht"
  },
  {
    name: "Keen Coffee Bar",
    description: "Nieuw proeflokaal met single-origins en custom Kees van der Westen machine.",
    address: "Ganzenmarkt 5, Utrecht",
    latitude: 52.0912,
    longitude: 5.1159,
    phone: "+31 30 987 6543",
    website: "https://keencoffeebar.nl",
    rating: 4.5,
    reviewCount: 200,
    priceRange: "BUDGET" as const, // €1–10
    features: ["Single origin", "Laptop-friendly", "Vegan options"],
    hours: {
      "Mon-Sat": "7AM-7PM",
      "Sun": "Closed"
    },
    photos: ["https://example.com/photo_utrecht3.jpg"],
    isVerified: true,
    city: "Utrecht"
  },

  // AMSTERDAM (EXPAND EXISTING)
  {
    name: "Kafenion",
    description: "Griekse sfeer en uitstekende koffie; hondvriendelijk.",
    address: "Bloemgracht 70, Amsterdam",
    latitude: 52.3759,
    longitude: 4.8810,
    phone: "+31 20 123 4567",
    website: "https://kafenion.nl",
    rating: 4.9,
    reviewCount: 3200,
    priceRange: "BUDGET" as const, // €1–10
    features: ["Outdoor seating", "Vegan options", "Wi-Fi"],
    hours: {
      "Mon-Sun": "8AM-8PM"
    },
    photos: ["https://example.com/photo_amsterdam1.jpg"],
    isVerified: true,
    city: "Amsterdam"
  },
  {
    name: "De Koffiesalon Spui",
    description: "Populaire koffiezaak met lange openingstijden en eigen blend.",
    address: "Spuistraat 281, Amsterdam",
    latitude: 52.3728,
    longitude: 4.8936,
    phone: "+31 20 234 5678",
    website: "https://koffiesalon.nl",
    rating: 4.8,
    reviewCount: 1800,
    priceRange: "BUDGET" as const, // €1–10
    features: ["Wi-Fi", "Laptop-friendly", "Takeaway"],
    hours: {
      "Daily": "7AM-8PM"
    },
    photos: ["https://example.com/photo_amsterdam2.jpg"],
    isVerified: true,
    city: "Amsterdam"
  },
  {
    name: "Wakuli specialty coffee bar",
    description: "Direct-trade specialty coffee roaster with a family-friendly vibe.",
    address: "Linnaeusstraat 237, Amsterdam",
    latitude: 52.3598,
    longitude: 4.9395,
    phone: "+31 20 345 6789",
    website: "https://wakuli.com",
    rating: 4.7,
    reviewCount: 800,
    priceRange: "BUDGET" as const, // €1–10
    features: ["On-site roasting", "Vegan options", "Wi-Fi", "Family-friendly"],
    hours: {
      "Mon-Fri": "8AM-6PM",
      "Sat-Sun": "9AM-5PM"
    },
    photos: ["https://example.com/photo_amsterdam3.jpg"],
    isVerified: true,
    city: "Amsterdam"
  },

  // DEN HAAG (NEW CITY)
  {
    name: "Ief & Ido Coffee Roasting Shop/Bar",
    description: "Microbranderij met hand-brews en duurzame koffie; hoge rating.",
    address: "Prinsestraat 35, Den Haag",
    latitude: 52.0765,
    longitude: 4.2989,
    phone: "+31 70 123 4567",
    website: "https://iefido.nl",
    rating: 4.9,
    reviewCount: 280,
    priceRange: "BUDGET" as const, // €1–10
    features: ["On-site roasting", "Vegan options", "Wi-Fi"],
    hours: {
      "Wed-Sun": "9AM-6PM",
      "Mon-Tue": "Closed"
    },
    photos: ["https://example.com/photo_denhaag1.jpg"],
    isVerified: true,
    city: "Den Haag"
  },
  {
    name: "Fleur's Koffie",
    description: "Trendy koffiebar met huiselijke sfeer en vegan opties.",
    address: "Segbroeklaan 12, Den Haag",
    latitude: 52.0718,
    longitude: 4.3100,
    phone: "+31 70 234 5678",
    website: "https://fleurskoffie.nl",
    rating: 4.7,
    reviewCount: 405,
    priceRange: "BUDGET" as const, // €1–10
    features: ["Wi-Fi", "Vegan options", "Laptop-friendly"],
    hours: {
      "Tue-Sun": "8AM-7PM"
    },
    photos: ["https://example.com/photo_denhaag2.jpg"],
    isVerified: true,
    city: "Den Haag"
  },
  {
    name: "Wakuli specialty coffee bar",
    description: "Specialty coffee bar with sustainable direct-trade focus.",
    address: "Prinsegracht 55, Den Haag",
    latitude: 52.0792,
    longitude: 4.3125,
    phone: "+31 70 345 6789",
    website: "https://wakuli.com",
    rating: 4.8,
    reviewCount: 600,
    priceRange: "BUDGET" as const, // €1–10
    features: ["On-site roasting", "Vegan options", "Wi-Fi"],
    hours: {
      "Mon-Fri": "8AM-6PM",
      "Sat": "9AM-4PM",
      "Sun": "Closed"
    },
    photos: ["https://example.com/photo_denhaag3.jpg"],
    isVerified: true,
    city: "Den Haag"
  },
  {
    name: "Barista Café Frederikstraat",
    description: "Popular breakfast and lunch spot with great coffee and vegetarian options.",
    address: "Frederikstraat 22, Den Haag",
    latitude: 52.0785,
    longitude: 4.3160,
    phone: "+31 70 456 7890",
    website: "https://baristacafe.nl",
    rating: 4.6,
    reviewCount: 500,
    priceRange: "BUDGET" as const, // €1–10
    features: ["Wi-Fi", "Vegetarian options", "Takeaway"],
    hours: {
      "Daily": "7AM-5PM"
    },
    photos: ["https://example.com/photo_denhaag4.jpg"],
    isVerified: true,
    city: "Den Haag"
  },
  {
    name: "DuckRabbit Coffee Brewers",
    description: "Intimate specialty coffee bar with high rating and focus on craftsmanship.",
    address: "Breestraat 10, Den Haag",
    latitude: 52.0734,
    longitude: 4.2980,
    phone: "+31 70 567 8901",
    website: "https://duckrabbit.nl",
    rating: 4.9,
    reviewCount: 350,
    priceRange: "BUDGET" as const, // €1–10
    features: ["Vegan options", "Hand-brews", "Takeaway"],
    hours: {
      "Mon-Sun": "8AM-6PM"
    },
    photos: ["https://example.com/photo_denhaag5.jpg"],
    isVerified: true,
    city: "Den Haag"
  },
  {
    name: "The Bookstor Café",
    description: "Bookshop-café with specialty coffee and relaxed atmosphere.",
    address: "Lange Voorhout 22, Den Haag",
    latitude: 52.0730,
    longitude: 4.2984,
    phone: "+31 70 678 9012",
    website: "https://bookstor.nl",
    rating: 4.7,
    reviewCount: 400,
    priceRange: "BUDGET" as const, // €1–10
    features: ["Books", "Wi-Fi", "Outdoor seating"],
    hours: {
      "Mon-Sun": "8AM-7PM"
    },
    photos: ["https://example.com/photo_denhaag6.jpg"],
    isVerified: true,
    city: "Den Haag"
  },
  {
    name: "Pistache Café",
    description: "Popular vegan-friendly café with brunch and colorful interior.",
    address: "Prinsestraat 45, Den Haag",
    latitude: 52.0790,
    longitude: 4.2987,
    phone: "+31 70 789 0123",
    website: "https://pistachecafe.nl",
    rating: 4.6,
    reviewCount: 420,
    priceRange: "MODERATE" as const, // €1–20
    features: ["Vegan options", "Brunch", "Outdoor seating"],
    hours: {
      "Tue-Sun": "9AM-5PM",
      "Mon": "Closed"
    },
    photos: ["https://example.com/photo_denhaag7.jpg"],
    isVerified: true,
    city: "Den Haag"
  },

  // ROTTERDAM (EXISTING - Add reference for completeness)
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
  }
  // Note: Rotterdam already has 17 cafés from previous seeding
];

export async function POST(request: NextRequest) {
  try {
    console.log('🏪 Starting all cities cafés seeding...');
    
    let addedCount = 0;
    let skippedCount = 0;
    const errors: string[] = [];
    const cityStats: Record<string, number> = {};

    for (const cafe of allCityCafes) {
      try {
        // Check if cafe already exists
        const existingCafe = await prisma.coffeeShop.findFirst({
          where: {
            name: cafe.name,
            city: cafe.city
          }
        });

        if (existingCafe) {
          console.log(`⚠️  Café "${cafe.name}" in ${cafe.city} already exists, skipping...`);
          skippedCount++;
          continue;
        }

        // Create new cafe
        const createdCafe = await prisma.coffeeShop.create({
          data: cafe
        });

        console.log(`✅ Added: ${createdCafe.name} (${createdCafe.city})`);
        addedCount++;
        
        // Track city stats
        if (!cityStats[cafe.city]) {
          cityStats[cafe.city] = 0;
        }
        cityStats[cafe.city] = (cityStats[cafe.city] || 0) + 1;

      } catch (error) {
        const errorMsg = `Failed to add ${cafe.name} (${cafe.city}): ${error}`;
        console.error(errorMsg);
        errors.push(errorMsg);
      }
    }

    // Get final counts by city
    const finalCityStats: Record<string, number> = {};
    const cities = ['Amsterdam', 'Rotterdam', 'Utrecht', 'Den Haag', 'Rhoon'];
    
    for (const city of cities) {
      const count = await prisma.coffeeShop.count({
        where: { city }
      });
      finalCityStats[city] = count;
    }

    const totalCafes = await prisma.coffeeShop.count();

    return NextResponse.json({
      success: true,
      message: 'All cities cafés seeding completed',
      stats: {
        added: addedCount,
        skipped: skippedCount,
        errors: errors.length,
        totalCafes,
        cityBreakdown: finalCityStats,
        newCitiesAdded: ['Utrecht', 'Den Haag', 'Rhoon']
      },
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('❌ Error seeding all cities cafés:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to seed all cities cafés', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Group cafes by city for overview
    const cafesByCity = allCityCafes.reduce((acc, cafe) => {
      if (!acc[cafe.city]) {
        acc[cafe.city] = [];
      }
      const cityArray = acc[cafe.city];
      if (cityArray) {
        cityArray.push({
          name: cafe.name,
          address: cafe.address,
          rating: cafe.rating,
          priceRange: cafe.priceRange,
          features: cafe.features
        });
      }
      return acc;
    }, {} as Record<string, any[]>);

    return NextResponse.json({
      message: 'All cities cafés seeding endpoint',
      cities: Object.keys(cafesByCity),
      totalAvailableCafes: allCityCafes.length,
      breakdown: Object.fromEntries(
        Object.entries(cafesByCity).map(([city, cafes]) => [
          city, 
          { count: cafes.length, cafes }
        ])
      ),
      newCities: ['Utrecht', 'Den Haag', 'Rhoon'],
      instructions: 'Send a POST request to this endpoint to seed the database with all city cafés'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get cafe data' },
      { status: 500 }
    );
  }
}