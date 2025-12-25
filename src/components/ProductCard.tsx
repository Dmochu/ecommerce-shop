'use client'

import Link from 'next/link'
import { ShoppingCart, Eye, Heart } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useWishlist } from '@/hooks/useWishlist'
import { useBehaviorTracking } from '@/hooks/useRecommendations'
import { useTranslations, useLocale } from 'next-intl'
import { getStockAvailabilityForTranslations } from '@/lib/stock-availability'
import { useState, useEffect } from 'react'

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  stock: number
  category: {
    name: string
  }
}

interface ProductCardProps {
  product?: Product
  productId?: string
  variant?: 'default' | 'compact'
  showReason?: boolean
  reason?: string
  onView?: () => void
}

export default function ProductCard({ 
  product, 
  productId, 
  variant = 'default',
  showReason = false,
  reason,
  onView
}: ProductCardProps) {
  const { addToCart } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const { trackView, trackAddToCart } = useBehaviorTracking()
  const t = useTranslations()
  const locale = useLocale()
  const [wishlistLoading, setWishlistLoading] = useState(false)
  const [productData, setProductData] = useState<Product | null>(product || null)
  const [loading, setLoading] = useState(false)

  // Fetch product data if only productId is provided
  useEffect(() => {
    if (productId && !product) {
      setLoading(true)
      fetch(`/api/products/${productId}`)
        .then(res => res.json())
        .then(data => {
          if (data.product) {
            setProductData(data.product)
          }
        })
        .catch(err => console.error('Error fetching product:', err))
        .finally(() => setLoading(false))
    }
  }, [productId, product])

  // Track view when component mounts
  useEffect(() => {
    if (productData && onView) {
      onView()
    } else if (productData) {
      trackView(productData.id)
    }
  }, [productData, onView, trackView])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 animate-pulse">
        <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 bg-gray-200 rounded mb-2"></div>
        <div className="h-6 bg-gray-200 rounded"></div>
      </div>
    )
  }

  if (!productData) {
    return null
  }
  
  // Get stock availability information
  const stockInfo = getStockAvailabilityForTranslations(productData.stock, t)
  
  const handleAddToCart = () => {
    addToCart({
      id: productData.id,
      name: productData.name,
      price: productData.price,
      image: productData.image,
      stock: productData.stock
    })
    
    // Track behavior
    trackAddToCart(productData.id)
    
    // Show custom notification with translation
    const notification = document.createElement('div')
    notification.className = 'cart-notification fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300'
    notification.textContent = `${productData.name} ${t('products.addedToCart')}`
    
    document.body.appendChild(notification)
    
    setTimeout(() => {
      notification.classList.remove('translate-x-full')
    }, 100)
    
    setTimeout(() => {
      notification.classList.add('translate-x-full')
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification)
        }
      }, 300)
    }, 3000)
  }

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (wishlistLoading) return
    
    setWishlistLoading(true)
    const success = await toggleWishlist(productData.id)
    
    if (success) {
      const isAdded = isInWishlist(productData.id)
      const notification = document.createElement('div')
      notification.className = 'wishlist-notification fixed top-4 right-4 bg-pink-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300'
      notification.textContent = isAdded 
        ? `${productData.name} dodano do listy życzeń` 
        : `${productData.name} usunięto z listy życzeń`
      
      document.body.appendChild(notification)
      
      setTimeout(() => {
        notification.classList.remove('translate-x-full')
      }, 100)
      
      setTimeout(() => {
        notification.classList.add('translate-x-full')
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification)
          }
        }, 300)
      }, 3000)
    }
    
    setWishlistLoading(false)
  }

  // Render different variants
  if (variant === 'compact') {
    return (
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group border border-gray-200 hover:border-gray-300">
        <Link href={`/${locale}/products/${productData.id}`} className="block">
          <div className="flex">
            <div className="relative w-20 h-20 bg-gradient-to-br from-tulinki-rose/20 to-tulinki-peach/20">
              {productData.image ? (
                <img
                  src={productData.image}
                  alt={productData.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-400 text-xs">Brak zdjęcia</span>
                </div>
              )}
            </div>
            
            <div className="flex-1 p-3">
              <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                {productData.name}
              </h3>
              <p className="text-sm font-semibold text-tulinki-burgundy">
                {productData.price.toFixed(2)} zł
              </p>
              {showReason && reason && (
                <p className="text-xs text-gray-500 mt-1">{reason}</p>
              )}
            </div>
          </div>
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-tulinki-beige rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group border border-tulinki-rose/20 hover:border-tulinki-rose/40 touch-manipulation">
      <Link href={`/${locale}/products/${productData.id}`} className="block">
        {/* Product Image */}
        <div className="relative h-32 sm:h-40 md:h-48 bg-gradient-to-br from-tulinki-rose/20 to-tulinki-peach/20">
          {productData.image ? (
            <img
              src={productData.image}
              alt={productData.name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-tulinki-soft text-sm">Brak zdjęcia</span>
            </div>
          )}
          
          {/* Quick Actions */}
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              onClick={handleWishlistToggle}
              disabled={wishlistLoading}
              className={`p-1.5 sm:p-2 rounded-full shadow-sm hover:shadow-md transition-all duration-200 border ${
                isInWishlist(productData.id)
                  ? 'bg-pink-500 text-white border-pink-500 hover:bg-pink-600'
                  : 'bg-tulinki-cream border-tulinki-rose/30 hover:bg-tulinki-rose/20'
              } ${wishlistLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={isInWishlist(productData.id) ? 'Usuń z listy życzeń' : 'Dodaj do listy życzeń'}
            >
              <Heart 
                className={`h-3 w-3 sm:h-4 sm:w-4 ${
                  isInWishlist(productData.id) ? 'fill-current' : ''
                }`} 
              />
            </button>
            <div className="p-1.5 sm:p-2 bg-tulinki-cream rounded-full shadow-sm hover:shadow-md transition-shadow border border-tulinki-rose/30">
              <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-tulinki-burgundy" />
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-2 sm:p-3 md:p-4">
          <div className="mb-2 flex flex-wrap gap-1 sm:gap-2">
            <span className="text-xs text-tulinki-burgundy bg-tulinki-rose/20 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border border-tulinki-rose/30">
              {productData.category.name}
            </span>
            {/* Stock Availability Badge */}
            <span className={`text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border ${stockInfo.color} ${stockInfo.bgColor} ${stockInfo.borderColor}`}>
              <span className="mr-1">{stockInfo.icon}</span>
              {stockInfo.label}
            </span>
          </div>
          
          <h3 className="font-medium text-tulinki-warm mb-1 sm:mb-2 text-sm sm:text-base line-clamp-2 group-hover:text-tulinki-burgundy transition-colors">
            {productData.name}
          </h3>
          
          {showReason && reason && (
            <p className="text-xs text-blue-600 mb-1 font-medium">
              {reason}
            </p>
          )}
          
          <p className="text-tulinki-soft text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2 hidden sm:block">
            {productData.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base sm:text-lg font-semibold text-tulinki-burgundy">
                {productData.price.toFixed(2)} zł
              </p>
              <p className="text-xs text-tulinki-soft font-medium">
                {t('products.stock')}: {productData.stock} szt.
              </p>
              <p className="text-xs text-tulinki-soft hidden sm:block">
                {stockInfo.description}
              </p>
            </div>
            
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleAddToCart()
              }}
              disabled={productData.stock === 0}
              className={`p-2 sm:p-2.5 rounded-full transition-all duration-200 shadow-sm hover:shadow-md min-w-[44px] min-h-[44px] flex items-center justify-center ${
                productData.stock === 0 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : stockInfo.status === 'very-low-stock' || stockInfo.status === 'low-stock'
                  ? 'bg-orange-500 text-white hover:bg-orange-600 hover:scale-110'
                  : 'bg-tulinki-burgundy text-white hover:bg-tulinki-wine hover:scale-110'
              }`}
              title={productData.stock === 0 ? t('products.outOfStock') : stockInfo.description}
            >
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>
      </Link>
    </div>
  )
}
