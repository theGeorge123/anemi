import { prisma } from '@/lib/prisma';

/**
 * Soft delete utilities for meetups and other user-generated content
 * R07: Implement soft deletes for user-generated content (deletedAt field)
 */

export interface SoftDeleteOptions {
  userId: string;
  reason?: string;
}

/**
 * Soft delete a meetup by setting deletedAt timestamp
 * This preserves history while hiding cancelled events
 */
export async function softDeleteMeetup(
  meetupId: string, 
  options: SoftDeleteOptions
) {
  return await prisma.meetup.update({
    where: {
      id: meetupId,
      createdBy: options.userId, // Ensure user owns the meetup
    },
    data: {
      deletedAt: new Date(),
      status: 'CANCELLED',
    },
  });
}

/**
 * Restore a soft-deleted meetup
 */
export async function restoreMeetup(
  meetupId: string, 
  options: SoftDeleteOptions
) {
  return await prisma.meetup.update({
    where: {
      id: meetupId,
      createdBy: options.userId,
    },
    data: {
      deletedAt: null,
      status: 'SCHEDULED',
    },
  });
}

/**
 * Get active meetups (not soft deleted)
 */
export async function getActiveMeetups(filters?: {
  category?: string;
  location?: { lat: number; lng: number; radius: number };
  date?: { from: Date; to: Date };
}) {
  const where: any = {
    deletedAt: null, // Only active meetups
  };

  if (filters?.category) {
    where.category = filters.category;
  }

  if (filters?.date) {
    where.date = {
      gte: filters.date.from,
      lte: filters.date.to,
    };
  }

  return await prisma.meetup.findMany({
    where,
    include: {
      createdByUser: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      participants: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
      _count: {
        select: {
          participants: true,
          reviews: true,
        },
      },
    },
    orderBy: {
      date: 'asc',
    },
  });
}

/**
 * Get meetups near a location (with soft delete filter)
 * Uses the spatial index for fast location-based queries
 */
export async function getMeetupsNearLocation(
  latitude: number,
  longitude: number,
  radiusKm: number = 10
) {
  // Calculate bounding box for efficient querying
  const latDelta = radiusKm / 111.32; // Approximate km per degree latitude
  const lngDelta = radiusKm / (111.32 * Math.cos(latitude * Math.PI / 180));

  return await prisma.meetup.findMany({
    where: {
      deletedAt: null, // Only active meetups
      latitude: {
        gte: latitude - latDelta,
        lte: latitude + latDelta,
      },
      longitude: {
        gte: longitude - lngDelta,
        lte: longitude + lngDelta,
      },
    },
    include: {
      createdByUser: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      _count: {
        select: {
          participants: true,
        },
      },
    },
    orderBy: {
      date: 'asc',
    },
  });
}

/**
 * Permanently delete meetups older than specified days
 * Use with caution - this is irreversible
 */
export async function permanentlyDeleteOldMeetups(daysOld: number = 365) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  return await prisma.meetup.deleteMany({
    where: {
      deletedAt: {
        not: null,
        lt: cutoffDate,
      },
    },
  });
} 