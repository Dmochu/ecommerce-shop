'use client'

import { useState, useEffect } from 'react'

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

export function useWishlist() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(false)

  // Pobierz listę życzeń
  const fetchWishlist = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/wishlist')
      if (response.ok) {
        const data = await response.json()
        setWishlist(data.items || [])
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error)
    } finally {
      setLoading(false)
    }
  }

  // Dodaj do listy życzeń
  const addToWishlist = async (productId: string) => {
    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId })
      })

      if (response.ok) {
        await fetchWishlist()
        return true
      }
      return false
    } catch (error) {
      console.error('Error adding to wishlist:', error)
      return false
    }
  }

  // Usuń z listy życzeń
  const removeFromWishlist = async (productId: string) => {
    try {
      const response = await fetch(`/api/wishlist/${productId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchWishlist()
        return true
      }
      return false
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      return false
    }
  }

  // Sprawdź czy produkt jest w liście życzeń
  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.productId === productId)
  }

  // Przełącz status w liście życzeń
  const toggleWishlist = async (productId: string) => {
    if (isInWishlist(productId)) {
      return await removeFromWishlist(productId)
    } else {
      return await addToWishlist(productId)
    }
  }

  useEffect(() => {
    fetchWishlist()
  }, [])

  return {
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    fetchWishlist
  }
}
