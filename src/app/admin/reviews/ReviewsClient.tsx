'use client'

import { useState, useEffect } from 'react'
import { 
  Star, 
  CheckCircle, 
  XCircle, 
  Eye, 
  ThumbsUp, 
  MessageCircle,
  Filter,
  Search,
  Calendar,
  User,
  Mail,
  Shield,
  Clock
} from 'lucide-react'

interface Review {
  id: string
  rating: number
  title: string
  content: string
  name: string
  email?: string
  verified: boolean
  approved: boolean
  helpful: number
  pros?: string
  cons?: string
  size?: string
  color?: string
  isAnonymous: boolean
  createdAt: string
  moderatedAt?: string
  moderationNote?: string
  product: {
    id: string
    name: string
    image?: string
  }
  user?: {
    name: string | null
    email: string
  }
  replies: {
    id: string
    content: string
    isOfficial: boolean
    createdAt: string
  }[]
}

interface ReviewStats {
  total: number
  pending: number
  approved: number
  rejected: number
  averageRating: number
}

export default function ReviewsClient() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    averageRating: 0
  })
  const [loading, setLoading] = useState(true)
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [filters, setFilters] = useState({
    status: 'all', // all, pending, approved, rejected
    rating: 'all', // all, 5, 4, 3, 2, 1
    search: ''
  })

  useEffect(() => {
    fetchReviews()
    fetchStats()
  }, [filters])

  const fetchReviews = async () => {
    try {
      const params = new URLSearchParams()
      if (filters.status !== 'all') params.append('status', filters.status)
      if (filters.rating !== 'all') params.append('rating', filters.rating)
      if (filters.search) params.append('search', filters.search)

      const response = await fetch(`/api/admin/reviews?${params}`)
      const data = await response.json()
      setReviews(data.reviews || [])
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/reviews/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleApprove = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}/approve`, {
        method: 'POST'
      })
      
      if (response.ok) {
        setReviews(reviews.map(review => 
          review.id === reviewId 
            ? { ...review, approved: true, moderatedAt: new Date().toISOString() }
            : review
        ))
        fetchStats()
      }
    } catch (error) {
      console.error('Error approving review:', error)
    }
  }

  const handleReject = async (reviewId: string, reason: string) => {
    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      })
      
      if (response.ok) {
        setReviews(reviews.filter(review => review.id !== reviewId))
        fetchStats()
        setShowModal(false)
      }
    } catch (error) {
      console.error('Error rejecting review:', error)
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    )
  }

  const getStatusBadge = (review: Review) => {
    if (review.approved) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Zatwierdzona
        </span>
      )
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <Clock className="h-3 w-3 mr-1" />
        Oczekuje
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tulinki-burgundy"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Statystyki */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <MessageCircle className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Wszystkie recenzje</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Oczekujące</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Zatwierdzone</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.approved}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <XCircle className="h-8 w-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Odrzucone</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.rejected}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <Star className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Średnia ocena</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.averageRating.toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtry */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-tulinki-rose focus:border-transparent"
            >
              <option value="all">Wszystkie</option>
              <option value="pending">Oczekujące</option>
              <option value="approved">Zatwierdzone</option>
              <option value="rejected">Odrzucone</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ocena
            </label>
            <select
              value={filters.rating}
              onChange={(e) => setFilters({...filters, rating: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-tulinki-rose focus:border-transparent"
            >
              <option value="all">Wszystkie</option>
              <option value="5">5 gwiazdek</option>
              <option value="4">4 gwiazdki</option>
              <option value="3">3 gwiazdki</option>
              <option value="2">2 gwiazdki</option>
              <option value="1">1 gwiazdka</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Szukaj
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                placeholder="Szukaj recenzji..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-tulinki-rose focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => setFilters({status: 'all', rating: 'all', search: ''})}
              className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Wyczyść filtry
            </button>
          </div>
        </div>
      </div>

      {/* Lista recenzji */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Recenzje ({reviews.length})
          </h3>
        </div>
        
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Brak recenzji do wyświetlenia</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {reviews.map((review) => (
              <li key={review.id} className="px-4 py-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="flex-shrink-0">
                        {review.product.image ? (
                          <img
                            src={review.product.image}
                            alt={review.product.name}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-gray-500 text-sm">P</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {review.product.name}
                          </h4>
                          {getStatusBadge(review)}
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {review.user?.name || review.name}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(review.createdAt).toLocaleDateString('pl-PL')}
                          </div>
                          {review.verified && (
                            <div className="flex items-center text-green-600">
                              <Shield className="h-4 w-4 mr-1" />
                              Zweryfikowana
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      {renderStars(review.rating)}
                      <h5 className="text-sm font-medium text-gray-900 mt-1">
                        {review.title}
                      </h5>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {review.content}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {review.helpful} pomocnych
                      </div>
                      {review.replies.length > 0 && (
                        <div className="flex items-center">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {review.replies.length} odpowiedzi
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => {
                        setSelectedReview(review)
                        setShowModal(true)
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    
                    {!review.approved && (
                      <>
                        <button
                          onClick={() => handleApprove(review.id)}
                          className="p-2 text-green-600 hover:text-green-700 transition-colors"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedReview(review)
                            setShowModal(true)
                          }}
                          className="p-2 text-red-600 hover:text-red-700 transition-colors"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
