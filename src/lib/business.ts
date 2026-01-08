import type { Business } from '@/types/domain'
import { mockBusinesses } from '@/mocks/businesses'

/**
 * Business data adapter layer
 *
 * This module provides a REST-like interface for fetching business data.
 * Currently uses mock data, but structured to easily swap for real API calls.
 *
 * To swap for production REST API:
 * 1. Replace getBusinessBySlugMock with fetch() calls
 * 2. Add Next.js cache/revalidation options
 * 3. Add error handling and fallbacks
 */

// Mock implementation (current)
export const getBusinessBySlugMock = (slug: string): Business | null => {
  return mockBusinesses.find((b) => b.slug === slug) ?? null
}

/**
 * Production-ready fetch function (future implementation)
 *
 * Uncomment and adapt when backend API is ready:
 *
 * export const fetchBusinessBySlug = async (slug: string): Promise<Business | null> => {
 *   try {
 *     const res = await fetch(`${process.env.API_BASE_URL}/api/businesses/${slug}`, {
 *       next: {
 *         revalidate: 300, // ISR: revalidate every 5 minutes
 *         tags: [`business-${slug}`] // for on-demand revalidation
 *       }
 *     })
 *
 *     if (!res.ok) {
 *       if (res.status === 404) return null
 *       throw new Error(`Failed to fetch business: ${res.status}`)
 *     }
 *
 *     const data = await res.json()
 *     return data as Business
 *   } catch (error) {
 *     console.error('Error fetching business:', error)
 *     return null
 *   }
 * }
 */

// Current export: use mock
export const fetchBusinessBySlug = getBusinessBySlugMock

// Helper to get all business slugs (for future sitemap generation, not for static params)
export const getAllBusinessSlugsMock = (): string[] => {
  return mockBusinesses.map((b) => b.slug)
}
