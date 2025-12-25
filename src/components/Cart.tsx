'use client'

import { useState } from 'react'
import { ShoppingCart, X, Plus, Minus, Trash2, Tag, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { useTranslations } from 'next-intl'
import { CartRecommendations } from './ProductRecommendations'

interface CartProps {
  isOpen: boolean
  onClose: () => void
}

export default function Cart({ isOpen, onClose }: CartProps) {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    getTotalPrice, 
    getTotalItems, 
    clearCart 
  } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const [showGuestForm, setShowGuestForm] = useState(false)
  const [guestData, setGuestData] = useState({
    email: '',
    name: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Polska',
    wantsInvoice: false,
    invoiceData: {
      companyName: '',
      nip: '',
      address: '',
      city: '',
      postalCode: ''
    }
  })
  
  // Stan kuponów
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null)
  const [couponError, setCouponError] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)
  
  const t = useTranslations()

  // Funkcje obsługi kuponów
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return
    
    setCouponLoading(true)
    setCouponError('')
    
    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: couponCode,
          orderValue: getTotalPrice()
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setAppliedCoupon(data.coupon)
        setCouponError('')
      } else {
        setCouponError(data.error || 'Nieprawidłowy kod kuponu')
        setAppliedCoupon(null)
      }
    } catch (error) {
      setCouponError('Wystąpił błąd podczas sprawdzania kuponu')
      setAppliedCoupon(null)
    } finally {
      setCouponLoading(false)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode('')
    setCouponError('')
  }

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0
    
    const total = getTotalPrice()
    
    switch (appliedCoupon.type) {
      case 'PERCENTAGE':
        const percentageDiscount = (total * appliedCoupon.value) / 100
        return appliedCoupon.maxDiscount 
          ? Math.min(percentageDiscount, appliedCoupon.maxDiscount)
          : percentageDiscount
      case 'FIXED_AMOUNT':
        return Math.min(appliedCoupon.value, total)
      case 'FREE_SHIPPING':
        return 0 // Darmowa dostawa - rabat będzie zastosowany przy dostawie
      default:
        return 0
    }
  }

  const getFinalTotal = () => {
    const total = getTotalPrice()
    const discount = calculateDiscount()
    return Math.max(0, total - discount)
  }

  const handleCheckout = async () => {
    setIsLoading(true)
    
    try {
      // Sprawdź czy użytkownik jest zalogowany
      const token = localStorage.getItem('token')
      
      // Utwórz zamówienie (z tokenem lub bez)
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price
          })),
          ...(appliedCoupon && {
            couponId: appliedCoupon.id,
            discountAmount: calculateDiscount()
          }),
          ...(showGuestForm && {
            guestEmail: guestData.email,
            guestName: guestData.name,
            guestPhone: guestData.phone,
            guestAddress: guestData.address,
            guestCity: guestData.city,
            guestPostalCode: guestData.postalCode,
            guestCountry: guestData.country,
            wantsInvoice: guestData.wantsInvoice,
            invoiceData: guestData.wantsInvoice ? guestData.invoiceData : null
          })
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create order')
      }

      const { orderId } = await response.json()
      
      // Wyczyść koszyk
      clearCart()
      
      // Zamknij koszyk
      onClose()
      
      // Przekieruj do płatności
      window.location.href = `/payment/${orderId}`
      
    } catch (error) {
      console.error('Error creating order:', error)
      alert('Wystąpił błąd podczas tworzenia zamówienia')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Cart Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              {t('cart.title')} ({getTotalItems()})
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-110"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">{t('cart.empty')}</p>
                <button
                  onClick={onClose}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  {t('cart.goToShop')}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.price.toFixed(2)} zł</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="p-1 hover:bg-gray-200 rounded disabled:opacity-50"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 hover:bg-red-100 text-red-600 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t p-4 space-y-4">
              {/* Formularz kuponu */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900 flex items-center">
                  <Tag className="h-4 w-4 mr-2" />
                  Kod rabatowy
                </h3>
                
                {!appliedCoupon ? (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Wprowadź kod kuponu"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={!couponCode.trim() || couponLoading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                    >
                      {couponLoading ? '...' : 'Zastosuj'}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-sm text-green-800">
                        Kupon "{appliedCoupon.name}" zastosowany
                      </span>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Usuń
                    </button>
                  </div>
                )}
                
                {couponError && (
                  <div className="flex items-center text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {couponError}
                  </div>
                )}
              </div>

              {/* Podsumowanie ceny */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Suma częściowa:</span>
                  <span className="font-medium">{getTotalPrice().toFixed(2)} zł</span>
                </div>
                
                {appliedCoupon && calculateDiscount() > 0 && (
                  <div className="flex justify-between items-center text-green-600">
                    <span>Rabat ({appliedCoupon.name}):</span>
                    <span className="font-medium">-{calculateDiscount().toFixed(2)} zł</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center border-t pt-2">
                  <span className="font-medium text-lg">Razem:</span>
                  <span className="font-bold text-lg text-blue-600">
                    {getFinalTotal().toFixed(2)} zł
                  </span>
                </div>
              </div>
              
              {/* Guest Checkout Form */}
              {showGuestForm && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg max-h-96 overflow-y-auto">
                  <h3 className="font-medium text-gray-900">Zakup jako gość</h3>
                  
                  {/* Podstawowe dane */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-700">Dane kontaktowe</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Imię i nazwisko *"
                        value={guestData.name}
                        onChange={(e) => setGuestData({...guestData, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                      <input
                        type="email"
                        placeholder="Email *"
                        value={guestData.email}
                        onChange={(e) => setGuestData({...guestData, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <input
                      type="tel"
                      placeholder="Telefon *"
                      value={guestData.phone}
                      onChange={(e) => setGuestData({...guestData, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>

                  {/* Adres dostawy */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-700">Adres dostawy</h4>
                    <input
                      type="text"
                      placeholder="Adres (ulica, numer) *"
                      value={guestData.address}
                      onChange={(e) => setGuestData({...guestData, address: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Miasto *"
                        value={guestData.city}
                        onChange={(e) => setGuestData({...guestData, city: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Kod pocztowy *"
                        value={guestData.postalCode}
                        onChange={(e) => setGuestData({...guestData, postalCode: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <select
                      value={guestData.country}
                      onChange={(e) => setGuestData({...guestData, country: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="Polska">Polska</option>
                      <option value="Niemcy">Niemcy</option>
                      <option value="Czechy">Czechy</option>
                      <option value="Słowacja">Słowacja</option>
                    </select>
                  </div>

                  {/* Faktura */}
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="wantsInvoice"
                        checked={guestData.wantsInvoice}
                        onChange={(e) => setGuestData({...guestData, wantsInvoice: e.target.checked})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="wantsInvoice" className="ml-2 text-sm text-gray-700">
                        Chcę otrzymać fakturę
                      </label>
                    </div>
                    
                    {guestData.wantsInvoice && (
                      <div className="space-y-2 pl-6 border-l-2 border-blue-200">
                        <h5 className="text-xs font-medium text-gray-600">Dane do faktury</h5>
                        <input
                          type="text"
                          placeholder="Nazwa firmy"
                          value={guestData.invoiceData.companyName}
                          onChange={(e) => setGuestData({
                            ...guestData, 
                            invoiceData: {...guestData.invoiceData, companyName: e.target.value}
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                        <input
                          type="text"
                          placeholder="NIP"
                          value={guestData.invoiceData.nip}
                          onChange={(e) => setGuestData({
                            ...guestData, 
                            invoiceData: {...guestData.invoiceData, nip: e.target.value}
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Adres firmy"
                          value={guestData.invoiceData.address}
                          onChange={(e) => setGuestData({
                            ...guestData, 
                            invoiceData: {...guestData.invoiceData, address: e.target.value}
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Miasto"
                            value={guestData.invoiceData.city}
                            onChange={(e) => setGuestData({
                              ...guestData, 
                              invoiceData: {...guestData.invoiceData, city: e.target.value}
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Kod pocztowy"
                            value={guestData.invoiceData.postalCode}
                            onChange={(e) => setGuestData({
                              ...guestData, 
                              invoiceData: {...guestData.invoiceData, postalCode: e.target.value}
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex space-x-2">
                <button
                  onClick={clearCart}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {t('cart.clearCart')}
                </button>
                
                {!showGuestForm && (
                  <button
                    onClick={() => setShowGuestForm(true)}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Zakup jako gość
                  </button>
                )}
                
                <button
                  onClick={handleCheckout}
                  disabled={isLoading || (showGuestForm && (!guestData.email || !guestData.name || !guestData.phone || !guestData.address || !guestData.city || !guestData.postalCode))}
                  className="flex-1 px-4 py-2 bg-tulinki-burgundy text-white rounded-lg hover:bg-tulinki-wine disabled:opacity-50 transition-colors"
                >
                  {isLoading ? t('common.loading') : t('cart.checkout')}
                </button>
              </div>
            </div>
          )}

          {/* Cart Recommendations */}
          {cartItems.length > 0 && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <CartRecommendations 
                productIds={cartItems.map(item => item.id)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
