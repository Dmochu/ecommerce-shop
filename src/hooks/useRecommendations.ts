'use client'

import { useState, useEffect, useCallback } from 'react'

export interface RecommendationResult {
  productId: string
  score: number
  reason: string
  type: string
}

export interface UseRecommendationsOptions {
  userId?: string
  sessionId?: string
  productId?: string
  categoryId?: string
  limit?: number
  autoFetch?: boolean
}

export function useRecommendations(options: UseRecommendationsOptions = {}) {
  const [recommendations, setRecommendations] = useState<RecommendationResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRecommendations = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (options.userId) params.append('userId', options.userId)
      if (options.sessionId) params.append('sessionId', options.sessionId)
      if (options.productId) params.append('productId', options.productId)
      if (options.categoryId) params.append('categoryId', options.categoryId)
      if (options.limit) params.append('limit', options.limit.toString())

      const response = await fetch(`/api/recommendations?${params}`)
      const data = await response.json()

      if (response.ok) {
        setRecommendations(data.recommendations || [])
      } else {
        setError(data.error || 'Failed to fetch recommendations')
      }
    } catch (err) {
      setError('Failed to fetch recommendations')
      console.error('Error fetching recommendations:', err)
    } finally {
      setLoading(false)
    }
  }, [options.userId, options.sessionId, options.productId, options.categoryId, options.limit])

  const trackBehavior = useCallback(async (
    productId: string,
    behaviorType: 'VIEW' | 'ADD_TO_CART' | 'PURCHASE' | 'WISHLIST' | 'SEARCH',
    metadata?: any
  ) => {
    try {
      await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: options.userId,
          sessionId: options.sessionId,
          productId,
          behaviorType,
          metadata
        }),
      })
    } catch (err) {
      console.error('Error tracking behavior:', err)
    }
  }, [options.userId, options.sessionId])

  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchRecommendations()
    }
  }, [fetchRecommendations, options.autoFetch])

  return {
    recommendations,
    loading,
    error,
    fetchRecommendations,
    trackBehavior
  }
}

// Hook dla śledzenia zachowań użytkownika
export function useBehaviorTracking() {
  const trackView = useCallback(async (productId: string, metadata?: any) => {
    try {
      await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          behaviorType: 'VIEW',
          metadata
        }),
      })
    } catch (err) {
      console.error('Error tracking view:', err)
    }
  }, [])

  const trackAddToCart = useCallback(async (productId: string, metadata?: any) => {
    try {
      await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          behaviorType: 'ADD_TO_CART',
          metadata
        }),
      })
    } catch (err) {
      console.error('Error tracking add to cart:', err)
    }
  }, [])

  const trackPurchase = useCallback(async (productId: string, metadata?: any) => {
    try {
      await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          behaviorType: 'PURCHASE',
          metadata
        }),
      })
    } catch (err) {
      console.error('Error tracking purchase:', err)
    }
  }, [])

  const trackWishlist = useCallback(async (productId: string, metadata?: any) => {
    try {
      await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          behaviorType: 'WISHLIST',
          metadata
        }),
      })
    } catch (err) {
      console.error('Error tracking wishlist:', err)
    }
  }, [])

  const trackSearch = useCallback(async (query: string, metadata?: any) => {
    try {
      await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: 'search',
          behaviorType: 'SEARCH',
          metadata: { query, ...metadata }
        }),
      })
    } catch (err) {
      console.error('Error tracking search:', err)
    }
  }, [])

  return {
    trackView,
    trackAddToCart,
    trackPurchase,
    trackWishlist,
    trackSearch
  }
}
