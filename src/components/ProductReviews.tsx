'use client'

import { useState } from 'react'
import { Star, ThumbsUp, ThumbsDown, MessageCircle, User, Mail, Calendar } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'

interface Review {
  id: string
  rating: number
  title: string
  content: string
  name: string
  email?: string
  verified: boolean
  approved: boolean
  createdAt: string
  helpful: number
  images?: string[]
  pros?: string
  cons?: string
  size?: string
  color?: string
  isAnonymous: boolean
  user?: {
    name: string | null
  }
  helpfulVotes?: {
    userId: string
    isHelpful: boolean
  }[]
  replies?: {
    id: string
    content: string
    isOfficial: boolean
    createdAt: string
    user: {
      name: string | null
    }
  }[]
}

interface ProductReviewsProps {
  productId: string
  reviews: Review[]
  averageRating: number
  totalReviews: number
}

export default function ProductReviews({ productId, reviews, averageRating, totalReviews }: ProductReviewsProps) {
  const t = useTranslations('reviews')
  const locale = useLocale()
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newReview, setNewReview] = useState({
    name: '',
    email: '',
    rating: 5,
    title: '',
    content: '',
    pros: '',
    cons: '',
    size: '',
    color: '',
    isAnonymous: false
  })

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/reviews/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          ...newReview
        })
      })

      if (response.ok) {
        setShowReviewForm(false)
        setNewReview({ 
          name: '', 
          email: '', 
          rating: 5, 
          title: '', 
          content: '',
          pros: '',
          cons: '',
          size: '',
          color: '',
          isAnonymous: false
        })
        // Refresh page or update reviews
        window.location.reload()
      }
    } catch (error) {
      console.error('Error submitting review:', error)
    }
  }

  const handleHelpfulVote = async (reviewId: string, isHelpful: boolean) => {
    try {
      const response = await fetch('/api/reviews/helpful', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reviewId,
          isHelpful
        })
      })

      if (response.ok) {
        // Refresh page or update helpful count
        window.location.reload()
      }
    } catch (error) {
      console.error('Error voting on review:', error)
    }
  }

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
      lg: 'h-5 w-5'
    }
    
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  const approvedReviews = reviews.filter(review => review.approved)

  return (
    <div className="bg-white rounded-lg shadow-sm border border-tulinki-rose/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-tulinki-warm mb-2">{t('title')}</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {renderStars(Math.round(averageRating), 'lg')}
              <span className="text-lg font-semibold text-tulinki-burgundy">
                {averageRating.toFixed(1)}
              </span>
            </div>
            <span className="text-tulinki-soft">
              {totalReviews} {t('reviewsCount', { count: totalReviews })}
            </span>
          </div>
        </div>
        
        <button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="px-4 py-2 bg-tulinki-burgundy text-white rounded-lg hover:bg-tulinki-wine transition-colors"
        >
          {t('writeReview')}
        </button>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="mb-8 p-6 bg-tulinki-beige rounded-lg border border-tulinki-rose/20">
          <h4 className="text-lg font-semibold text-tulinki-warm mb-4">{t('writeReview')}</h4>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-tulinki-warm mb-2">
                  {t('form.name')} *
                </label>
                <input
                  type="text"
                  required
                  value={newReview.name}
                  onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                  className="w-full px-3 py-2 border border-tulinki-rose/30 rounded-lg focus:ring-2 focus:ring-tulinki-rose focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-tulinki-warm mb-2">
                  {t('form.email')}
                </label>
                <input
                  type="email"
                  value={newReview.email}
                  onChange={(e) => setNewReview({...newReview, email: e.target.value})}
                  className="w-full px-3 py-2 border border-tulinki-rose/30 rounded-lg focus:ring-2 focus:ring-tulinki-rose focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-tulinki-warm mb-2">
                {t('form.rating')} *
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({...newReview, rating: star})}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= newReview.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-tulinki-soft">
                  {newReview.rating} {t('stars')}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-tulinki-warm mb-2">
                {t('form.title')} *
              </label>
              <input
                type="text"
                required
                value={newReview.title}
                onChange={(e) => setNewReview({...newReview, title: e.target.value})}
                className="w-full px-3 py-2 border border-tulinki-rose/30 rounded-lg focus:ring-2 focus:ring-tulinki-rose focus:border-transparent"
                placeholder={t('form.titlePlaceholder')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-tulinki-warm mb-2">
                {t('form.content')} *
              </label>
              <textarea
                required
                rows={4}
                value={newReview.content}
                onChange={(e) => setNewReview({...newReview, content: e.target.value})}
                className="w-full px-3 py-2 border border-tulinki-rose/30 rounded-lg focus:ring-2 focus:ring-tulinki-rose focus:border-transparent"
                placeholder={t('form.contentPlaceholder')}
              />
            </div>

            {/* Zalety i wady */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-tulinki-warm mb-2">
                  {t('form.pros')}
                </label>
                <textarea
                  rows={3}
                  value={newReview.pros}
                  onChange={(e) => setNewReview({...newReview, pros: e.target.value})}
                  className="w-full px-3 py-2 border border-tulinki-rose/30 rounded-lg focus:ring-2 focus:ring-tulinki-rose focus:border-transparent"
                  placeholder={t('form.prosPlaceholder')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-tulinki-warm mb-2">
                  {t('form.cons')}
                </label>
                <textarea
                  rows={3}
                  value={newReview.cons}
                  onChange={(e) => setNewReview({...newReview, cons: e.target.value})}
                  className="w-full px-3 py-2 border border-tulinki-rose/30 rounded-lg focus:ring-2 focus:ring-tulinki-rose focus:border-transparent"
                  placeholder={t('form.consPlaceholder')}
                />
              </div>
            </div>

            {/* Rozmiar i kolor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-tulinki-warm mb-2">
                  {t('form.size')}
                </label>
                <input
                  type="text"
                  value={newReview.size}
                  onChange={(e) => setNewReview({...newReview, size: e.target.value})}
                  className="w-full px-3 py-2 border border-tulinki-rose/30 rounded-lg focus:ring-2 focus:ring-tulinki-rose focus:border-transparent"
                  placeholder={t('form.sizePlaceholder')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-tulinki-warm mb-2">
                  {t('form.color')}
                </label>
                <input
                  type="text"
                  value={newReview.color}
                  onChange={(e) => setNewReview({...newReview, color: e.target.value})}
                  className="w-full px-3 py-2 border border-tulinki-rose/30 rounded-lg focus:ring-2 focus:ring-tulinki-rose focus:border-transparent"
                  placeholder={t('form.colorPlaceholder')}
                />
              </div>
            </div>

            {/* Anonimowa recenzja */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isAnonymous"
                checked={newReview.isAnonymous}
                onChange={(e) => setNewReview({...newReview, isAnonymous: e.target.checked})}
                className="h-4 w-4 text-tulinki-rose focus:ring-tulinki-rose border-gray-300 rounded"
              />
              <label htmlFor="isAnonymous" className="ml-2 text-sm text-tulinki-warm">
                {t('form.anonymous')}
              </label>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="px-4 py-2 text-tulinki-soft border border-tulinki-rose/30 rounded-lg hover:bg-tulinki-beige transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-tulinki-burgundy text-white rounded-lg hover:bg-tulinki-wine transition-colors"
              >
                {t('submitReview')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {approvedReviews.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 text-tulinki-soft mx-auto mb-4" />
            <p className="text-tulinki-soft">{t('noReviews')}</p>
          </div>
        ) : (
          approvedReviews.map((review) => (
            <div key={review.id} className="border-b border-tulinki-rose/10 pb-6 last:border-b-0">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-tulinki-rose/20 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-tulinki-burgundy" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-tulinki-warm">
                        {review.user?.name || review.name}
                      </span>
                      {review.verified && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {t('verified')}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {renderStars(review.rating, 'sm')}
                      <span className="text-sm text-tulinki-soft">
                        {new Date(review.createdAt).toLocaleDateString('pl-PL')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <h5 className="font-medium text-tulinki-warm mb-2">{review.title}</h5>
              <p className="text-tulinki-soft leading-relaxed mb-4">{review.content}</p>
              
              {/* Zalety i wady */}
              {(review.pros || review.cons) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {review.pros && (
                    <div className="bg-green-50 p-3 rounded-lg">
                      <h6 className="font-medium text-green-800 mb-1">Zalety:</h6>
                      <p className="text-sm text-green-700">{review.pros}</p>
                    </div>
                  )}
                  {review.cons && (
                    <div className="bg-red-50 p-3 rounded-lg">
                      <h6 className="font-medium text-red-800 mb-1">Wady:</h6>
                      <p className="text-sm text-red-700">{review.cons}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Rozmiar i kolor */}
              {(review.size || review.color) && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {review.size && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      Rozmiar: {review.size}
                    </span>
                  )}
                  {review.color && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                      Kolor: {review.color}
                    </span>
                  )}
                </div>
              )}

              {/* Zdjęcia */}
              {review.images && review.images.length > 0 && (
                <div className="mb-4">
                  <div className="flex space-x-2">
                    {review.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Zdjęcie recenzji ${index + 1}`}
                        className="w-16 h-16 object-cover rounded-lg border border-tulinki-rose/20"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Czy ta recenzja była pomocna? */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleHelpfulVote(review.id, true)}
                    className="flex items-center space-x-1 text-tulinki-soft hover:text-green-600 transition-colors"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span className="text-sm">Pomocna ({review.helpful})</span>
                  </button>
                  <button
                    onClick={() => handleHelpfulVote(review.id, false)}
                    className="flex items-center space-x-1 text-tulinki-soft hover:text-red-600 transition-colors"
                  >
                    <ThumbsDown className="h-4 w-4" />
                    <span className="text-sm">Nie pomocna</span>
                  </button>
                </div>
                
                <span className="text-xs text-tulinki-soft">
                  {new Date(review.createdAt).toLocaleDateString('pl-PL')}
                </span>
              </div>

              {/* Odpowiedzi */}
              {review.replies && review.replies.length > 0 && (
                <div className="mt-4 pl-4 border-l-2 border-tulinki-rose/20">
                  {review.replies.map((reply) => (
                    <div key={reply.id} className="mb-3 last:mb-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-tulinki-warm text-sm">
                          {reply.user.name}
                        </span>
                        {reply.isOfficial && (
                          <span className="px-2 py-1 bg-tulinki-burgundy text-white text-xs rounded-full">
                            Sklep
                          </span>
                        )}
                        <span className="text-xs text-tulinki-soft">
                          {new Date(reply.createdAt).toLocaleDateString('pl-PL')}
                        </span>
                      </div>
                      <p className="text-sm text-tulinki-soft">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
