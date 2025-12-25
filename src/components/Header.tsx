'use client'

import Link from 'next/link'
import { ShoppingCart, User, Menu, Heart, Package, MessageCircle } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useWishlist } from '@/hooks/useWishlist'
import Cart from './Cart'
import LoginModal from './LoginModal'
import LiveChat from './LiveChat'
import SearchAutocomplete from './SearchAutocomplete'
import LanguageSwitcher from './LanguageSwitcher'
import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'

export default function Header() {
  const { getTotalItems, openCart, isCartOpen, closeCart } = useCart()
  const { wishlist } = useWishlist()
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const t = useTranslations()
  const locale = useLocale()

  return (
    <header className="bg-tulinki-cream shadow-sm border-b border-tulinki-rose/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-tulinki-burgundy rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-tulinki-warm">{t('header.storeName')}</span>
          </Link>

          {/* Search Bar - Compact */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <SearchAutocomplete 
              placeholder={t('header.searchProducts')}
              className="w-full"
              onSearch={(query) => {
                window.location.href = `/search?q=${encodeURIComponent(query)}`
              }}
              onSuggestionClick={(suggestion) => {
                if (suggestion.url) {
                  window.location.href = suggestion.url
                }
              }}
            />
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href={`/${locale}/products`} className="text-tulinki-soft hover:text-tulinki-burgundy hover:bg-tulinki-rose/20 px-3 py-2 rounded-lg transition-all duration-200">
              {t('navigation.products')}
            </Link>
            <Link href={`/${locale}/categories`} className="text-tulinki-soft hover:text-tulinki-burgundy hover:bg-tulinki-rose/20 px-3 py-2 rounded-lg transition-all duration-200">
              {t('navigation.categories')}
            </Link>
            <Link href={`/${locale}/about`} className="text-tulinki-soft hover:text-tulinki-burgundy hover:bg-tulinki-rose/20 px-3 py-2 rounded-lg transition-all duration-200">
              {t('navigation.about')}
            </Link>
            <Link href={`/${locale}/track-order`} className="text-tulinki-soft hover:text-tulinki-burgundy hover:bg-tulinki-rose/20 px-3 py-2 rounded-lg transition-all duration-200">
              Śledź zamówienie
            </Link>
            <Link href={`/${locale}/faq`} className="text-tulinki-soft hover:text-tulinki-burgundy hover:bg-tulinki-rose/20 px-3 py-2 rounded-lg transition-all duration-200">
              FAQ
            </Link>
            <Link href="/admin" className="text-tulinki-soft hover:text-tulinki-burgundy hover:bg-tulinki-rose/20 px-3 py-2 rounded-lg transition-all duration-200">
              {t('navigation.admin')}
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <LanguageSwitcher />
            
            {/* Wishlist */}
            <Link
              href={`/${locale}/wishlist`}
              className="relative p-2 text-tulinki-soft hover:text-tulinki-burgundy hover:bg-tulinki-rose/20 rounded-lg transition-all duration-200 hover:scale-110 cursor-pointer"
            >
              <Heart className="h-6 w-6" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
                  {wishlist.length}
                </span>
              )}
            </Link>
            
            <button 
              onClick={openCart}
              className="relative p-2 text-tulinki-soft hover:text-tulinki-burgundy hover:bg-tulinki-rose/20 rounded-lg transition-all duration-200 hover:scale-110 cursor-pointer"
            >
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-tulinki-burgundy text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
                {getTotalItems()}
              </span>
            </button>
            <button 
              onClick={() => setIsChatOpen(true)}
              className="p-2 text-tulinki-soft hover:text-tulinki-burgundy hover:bg-tulinki-rose/20 rounded-lg transition-all duration-200 hover:scale-110 cursor-pointer"
            >
              <MessageCircle className="h-6 w-6" />
            </button>
            <button 
              onClick={() => setIsLoginOpen(true)}
              className="p-2 text-tulinki-soft hover:text-tulinki-burgundy hover:bg-tulinki-rose/20 rounded-lg transition-all duration-200 hover:scale-110 cursor-pointer"
            >
              <User className="h-6 w-6" />
            </button>
            <button className="md:hidden p-2 text-tulinki-soft hover:text-tulinki-burgundy hover:bg-tulinki-rose/20 rounded-lg transition-all duration-200 hover:scale-110 cursor-pointer">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Search - Compact */}
        <div className="md:hidden py-2">
          <SearchAutocomplete 
            placeholder={t('header.searchProducts')}
              className="w-full"
              onSearch={(query) => {
                window.location.href = `/search?q=${encodeURIComponent(query)}`
              }}
              onSuggestionClick={(suggestion) => {
                if (suggestion.url) {
                  window.location.href = suggestion.url
                }
              }}
            />
        </div>
      </div>
      
      {/* Cart Component */}
      <Cart isOpen={isCartOpen} onClose={closeCart} />
      
      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={() => {}}
      />
      
      {/* Live Chat */}
      <LiveChat 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)}
      />
    </header>
  )
}
