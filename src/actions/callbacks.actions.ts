'use server';

import { db } from "@/db";
import { callbacks, offers, properties } from "@/db/schema";
import { desc, eq, ilike, and, or } from "drizzle-orm";

export interface CallbackWithRelations {
  id: string;
  offerId: string;
  propertyId: string;
  userId: string;
  level: number;
  status: number;
  createdAt: Date;
  offerName: string | null;
  propertyName: string | null;
}

export interface FetchCallbacksParams {
  limit?: number;
  offset?: number;
  propertyFilter?: string;
  offerFilter?: string;
}

export async function fetchCallbacks({
  limit = 100,
  offset = 0,
  propertyFilter,
  offerFilter,
}: FetchCallbacksParams): Promise<{
  data: CallbackWithRelations[];
  hasMore: boolean;
  total: number;
}> {
  try {
    // Build filter conditions
    const conditions = [];
    
    if (propertyFilter && propertyFilter.trim()) {
      conditions.push(ilike(properties.name, `%${propertyFilter.trim()}%`));
    }
    
    if (offerFilter && offerFilter.trim()) {
      conditions.push(ilike(offers.title, `%${offerFilter.trim()}%`));
    }

    // Fetch data with filters
    const data = await db
      .select({
        id: callbacks.id,
        offerId: callbacks.offerId,
        propertyId: callbacks.propertyId,
        userId: callbacks.userId,
        level: callbacks.level,
        status: callbacks.status,
        createdAt: callbacks.createdAt,
        offerName: offers.title,
        propertyName: properties.name,
      })
      .from(callbacks)
      .leftJoin(offers, eq(callbacks.offerId, offers.id))
      .leftJoin(properties, eq(callbacks.propertyId, properties.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(callbacks.createdAt))
      .limit(limit + 1) // Fetch one extra to check if there's more
      .offset(offset);

    // Check if there are more items
    const hasMore = data.length > limit;
    const items = hasMore ? data.slice(0, limit) : data;

    // Get total count (for display purposes)
    const totalResult = await db
      .select({
        id: callbacks.id,
      })
      .from(callbacks)
      .leftJoin(offers, eq(callbacks.offerId, offers.id))
      .leftJoin(properties, eq(callbacks.propertyId, properties.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    return {
      data: items as CallbackWithRelations[],
      hasMore,
      total: totalResult.length,
    };
  } catch (error) {
    console.error('Error fetching callbacks:', error);
    throw new Error('Failed to fetch callbacks');
  }
}

export async function getCallbacksStats() {
  try {
    const allCallbacks = await db
      .select({
        status: callbacks.status,
        offerId: callbacks.offerId,
      })
      .from(callbacks);

    const completedCount = allCallbacks.filter(cb => cb.status === 1).length;
    const pendingCount = allCallbacks.filter(cb => cb.status === 0).length;
    const uniqueOffers = new Set(allCallbacks.map(cb => cb.offerId)).size;

    return {
      total: allCallbacks.length,
      completed: completedCount,
      pending: pendingCount,
      uniqueOffers,
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw new Error('Failed to fetch statistics');
  }
}