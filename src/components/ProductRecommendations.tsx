'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRecommendations, useBehaviorTracking } from '@/hooks/useRecommendations'
import ProductCard from './ProductCard'
import { Loader, Sparkles, TrendingUp, Users, Heart } from 'lucide-react'

interface ProductRecommendationsProps {
  productId: string
  categoryId?: string
  userId?: string
  sessionId?: string
  title?: string
  limit?: number
  showReason?: boolean
  className?: string
}

export default function ProductRecommendations({
  productId,
  categoryId,
  userId,
  sessionId,
  title = "Może Ci się spodobać",
  limit = 8,
  showReason = false,
  className = ""
}: ProductRecommendationsProps) {
  const [mounted, setMounted] = useState(false)
  
  const { recommendations, loading, error } = useRecommendations({
    userId,
    sessionId,
    productId,
    categoryId,
    limit,
    autoFetch: true
  })

  const { trackView } = useBehaviorTracking()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="flex justify-center py-8">
          <Loader className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      </div>
    )
  }

  if (error || recommendations.length === 0) {
    return null
  }

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'SIMILAR_PRODUCTS':
        return <Sparkles className="h-4 w-4 text-blue-600" />
      case 'FREQUENTLY_BOUGHT':
        return <Users className="h-4 w-4 text-green-600" />
      case 'TRENDING':
        return <TrendingUp className="h-4 w-4 text-orange-600" />
      case 'PERSONALIZED':
        return <Heart className="h-4 w-4 text-pink-600" />
      default:
        return <Sparkles className="h-4 w-4 text-gray-600" />
    }
  }

  const getRecommendationTitle = (type: string) => {
    switch (type) {
      case 'SIMILAR_PRODUCTS':
        return 'Podobne produkty'
      case 'FREQUENTLY_BOUGHT':
        return 'Często kupowane razem'
      case 'TRENDING':
        return 'Popularne teraz'
      case 'PERSONALIZED':
        return 'Dla Ciebie'
      default:
        return 'Rekomendowane'
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        {showReason && recommendations.length > 0 && (
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            {getRecommendationIcon(recommendations[0].type)}
            <span>{getRecommendationTitle(recommendations[0].type)}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {recommendations.slice(0, limit).map((recommendation, index) => (
          <div key={`${recommendation.productId}-${index}`} className="relative">
            <ProductCard 
              productId={recommendation.productId}
              onView={() => trackView(recommendation.productId)}
            />
            {showReason && (
              <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium text-gray-700 flex items-center space-x-1">
                {getRecommendationIcon(recommendation.type)}
                <span>{getRecommendationTitle(recommendation.type)}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {recommendations.length > limit && (
        <div className="text-center">
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            Zobacz więcej rekomendacji →
          </button>
        </div>
      )}
    </div>
  )
}

// Komponent dla rekomendacji w koszyku
export function CartRecommendations({
  productIds,
  userId,
  sessionId,
  className = ""
}: {
  productIds: string[]
  userId?: string
  sessionId?: string
  className?: string
}) {
  const { recommendations, loading } = useRecommendations({
    userId,
    sessionId,
    limit: 4,
    autoFetch: true
  })

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900">Może Ci się spodobać</h3>
        <div className="flex justify-center py-4">
          <Loader className="h-5 w-5 animate-spin text-blue-600" />
        </div>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return null
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center space-x-2">
        <Users className="h-5 w-5 text-green-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Często kupowane razem
        </h3>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {recommendations.slice(0, 4).map((recommendation, index) => (
          <div key={`${recommendation.productId}-${index}`}>
            <ProductCard 
              productId={recommendation.productId}
              variant="compact"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// Komponent dla rekomendacji na stronie głównej
export function HomeRecommendations({
  userId,
  sessionId,
  className = ""
}: {
  userId?: string
  sessionId?: string
  className?: string
}) {
  const { recommendations, loading } = useRecommendations({
    userId,
    sessionId,
    limit: 8,
    autoFetch: true
  })

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center space-x-2">
          <Heart className="h-5 w-5 text-pink-600" />
          <h3 className="text-lg font-semibold text-gray-900">Dla Ciebie</h3>
        </div>
        <div className="flex justify-center py-8">
          <Loader className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return null
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Heart className="h-5 w-5 text-pink-600" />
          <h3 className="text-lg font-semibold text-gray-900">Dla Ciebie</h3>
        </div>
        <Link 
          href="/products" 
          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
        >
          Zobacz wszystkie →
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {recommendations.slice(0, 8).map((recommendation, index) => (
          <div key={`${recommendation.productId}-${index}`}>
            <ProductCard 
              productId={recommendation.productId}
              showReason={true}
              reason={recommendation.reason}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
