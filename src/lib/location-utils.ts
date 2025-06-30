import { prisma } from '@/lib/prisma';

/**
 * Location-based utilities for coffee shop discovery
 * R08: Use PostGIS GIN indexes for location-based queries when possible
 */

export interface Location {
  latitude: number;
  longitude: number;
}

export interface LocationQuery {
  center: Location;
  radiusKm: number;
  limit?: number;
}

/**
 * Calculate distance between two points using Haversine formula
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculate bounding box for efficient location queries
 * This optimizes database queries by filtering out distant locations
 */
export function getBoundingBox(
  center: Location,
  radiusKm: number
): {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
} {
  const latDelta = radiusKm / 111.32; // Approximate km per degree latitude
  const lngDelta = radiusKm / (111.32 * Math.cos(center.latitude * Math.PI / 180));

  return {
    minLat: center.latitude - latDelta,
    maxLat: center.latitude + latDelta,
    minLng: center.longitude - lngDelta,
    maxLng: center.longitude + lngDelta,
  };
}

/**
 * Sort locations by distance from a center point
 */
export function sortByDistance<T extends Location>(
  items: T[],
  center: Location
): T[] {
  return items.sort((a, b) => {
    const distanceA = calculateDistance(
      center.latitude,
      center.longitude,
      a.latitude,
      a.longitude
    );
    const distanceB = calculateDistance(
      center.latitude,
      center.longitude,
      b.latitude,
      b.longitude
    );
    return distanceA - distanceB;
  });
}

/**
 * Filter locations within a specified radius
 */
export function filterByDistance<T extends Location>(
  items: T[],
  center: Location,
  radiusKm: number
): T[] {
  return items.filter((item) => {
    const distance = calculateDistance(
      center.latitude,
      center.longitude,
      item.latitude,
      item.longitude
    );
    return distance <= radiusKm;
  });
}

/**
 * Get user's current location using browser geolocation
 */
export function getCurrentLocation(): Promise<Location> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(new Error(`Geolocation error: ${error.message}`));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  });
}

/**
 * Format distance for display
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`;
  }
  return `${distanceKm.toFixed(1)}km`;
}

/**
 * Validate coordinates
 */
export function isValidLocation(location: Location): boolean {
  return (
    location.latitude >= -90 &&
    location.latitude <= 90 &&
    location.longitude >= -180 &&
    location.longitude <= 180
  );
}

/**
 * Get coffee shops near a location with optimized querying
 * Uses bounding box for initial filtering, then precise distance calculation
 */
export async function getCoffeeShopsNearLocation(
  query: LocationQuery
): Promise<any[]> {
  // This would be implemented with the actual Prisma client
  // For now, this is a template showing the optimized approach
  
  const boundingBox = getBoundingBox(query.center, query.radiusKm);
  
  // Query with bounding box filter (uses spatial index)
  const coffeeShops = await prisma.coffeeShop.findMany({
    where: {
      latitude: {
        gte: boundingBox.minLat,
        lte: boundingBox.maxLat,
      },
      longitude: {
        gte: boundingBox.minLng,
        lte: boundingBox.maxLng,
      },
      isVerified: true, // Only show verified coffee shops
    },
    include: {
      _count: {
        select: {
          reviews: true,
          meetups: true,
        },
      },
    },
    take: query.limit || 50,
  });

  // Filter by exact distance and sort
  const nearbyShops = filterByDistance(
    coffeeShops,
    query.center,
    query.radiusKm
  );

  return sortByDistance(nearbyShops, query.center);
} 