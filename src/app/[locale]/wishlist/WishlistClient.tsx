'use client'

import { useState, useEffect } from 'react'
import { Heart, ShoppingCart, Trash2, Eye, Star } from 'lucide-react'
import { useWishlist } from '@/hooks/useWishlist'
import { useCart } from '@/contexts/CartContext'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'

interface WishlistItem {
  id: string
  productId: string
  product: {
    id: string
    name: string
    price: number
    image: string
    stock: number
  }
  createdAt: string
}

export default function WishlistClient() {
  const { wishlist, loading, removeFromWishlist, fetchWishlist } = useWishlist()
  const { addToCart } = useCart()
  const t = useTranslations()
  const locale = useLocale()
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set())

  const handleRemoveFromWishlist = async (productId: string) => {
    setRemovingItems(prev => new Set(prev).add(productId))
    const success = await removeFromWishlist(productId)
    setRemovingItems(prev => {
      const newSet = new Set(prev)
      newSet.delete(productId)
      return newSet
    })
    
    if (success) {
      // Show notification
      const notification = document.createElement('div')
      notification.className = 'wishlist-notification fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300'
      notification.textContent = 'Produkt usunięto z listy życzeń'
      
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
  }

  const handleAddToCart = (product: WishlistItem['product']) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      stock: product.stock
    })
    
    // Show notification
    const notification = document.createElement('div')
    notification.className = 'cart-notification fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300'
    notification.textContent = `${product.name} dodano do koszyka`
    
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

  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return { label: 'Brak w magazynie', color: 'text-red-600', bgColor: 'bg-red-100' }
    } else if (stock < 5) {
      return { label: 'Mało sztuk', color: 'text-orange-600', bgColor: 'bg-orange-100' }
    } else {
      return { label: 'Dostępny', color: 'text-green-600', bgColor: 'bg-green-100' }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-tulinki-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tulinki-burgundy"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-tulinki-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-tulinki-warm mb-2">Lista życzeń</h1>
          <p className="text-tulinki-soft">
            {wishlist.length === 0 
              ? 'Twoja lista życzeń jest pusta' 
              : `Masz ${wishlist.length} produktów w liście życzeń`
            }
          </p>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 text-tulinki-soft mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-tulinki-warm mb-2">
              Twoja lista życzeń jest pusta
            </h2>
            <p className="text-tulinki-soft mb-6">
              Dodaj produkty, które Cię interesują, klikając ikonę serca
            </p>
            <Link
              href={`/${locale}/products`}
              className="inline-flex items-center px-6 py-3 bg-tulinki-burgundy text-white rounded-lg hover:bg-tulinki-wine transition-colors"
            >
              <Eye className="h-4 w-4 mr-2" />
              Przeglądaj produkty
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((item) => {
              const stockStatus = getStockStatus(item.product.stock)
              const isRemoving = removingItems.has(item.productId)
              
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-sm border border-tulinki-rose/20 overflow-hidden hover:shadow-md transition-all duration-200"
                >
                  <div className="relative">
                    <Link href={`/${locale}/products/${item.product.id}`}>
                      <div className="h-48 bg-gradient-to-br from-tulinki-rose/20 to-tulinki-peach/20">
                        {item.product.image ? (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-tulinki-soft">Brak zdjęcia</span>
                          </div>
                        )}
                      </div>
                    </Link>
                    
                    {/* Remove from wishlist button */}
                    <button
                      onClick={() => handleRemoveFromWishlist(item.productId)}
                      disabled={isRemoving}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-200 hover:bg-red-50 hover:text-red-600"
                      title="Usuń z listy życzeń"
                    >
                      <Trash2 className={`h-4 w-4 ${isRemoving ? 'animate-pulse' : ''}`} />
                    </button>
                    
                    {/* Stock status */}
                    <div className="absolute top-2 left-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color} ${stockStatus.bgColor}`}>
                        {stockStatus.label}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <Link href={`/${locale}/products/${item.product.id}`}>
                      <h3 className="font-medium text-tulinki-warm mb-2 hover:text-tulinki-burgundy transition-colors line-clamp-2">
                        {item.product.name}
                      </h3>
                    </Link>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-semibold text-tulinki-burgundy">
                        {item.product.price.toFixed(2)} zł
                      </span>
                      <div className="flex items-center text-sm text-tulinki-soft">
                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        <span>4.5</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <button
                        onClick={() => handleAddToCart(item.product)}
                        disabled={item.product.stock === 0}
                        className={`w-full flex items-center justify-center px-4 py-2 rounded-lg transition-colors ${
                          item.product.stock === 0
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-tulinki-burgundy text-white hover:bg-tulinki-wine'
                        }`}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {item.product.stock === 0 ? 'Brak w magazynie' : 'Dodaj do koszyka'}
                      </button>
                      
                      <Link
                        href={`/${locale}/products/${item.product.id}`}
                        className="w-full flex items-center justify-center px-4 py-2 text-tulinki-burgundy border border-tulinki-rose/30 rounded-lg hover:bg-tulinki-rose/10 transition-colors"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Zobacz szczegóły
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
