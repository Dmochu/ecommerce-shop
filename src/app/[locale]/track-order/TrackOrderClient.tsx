'use client'

import { useState } from 'react'
import { Search, Package, Truck, CheckCircle, Clock, AlertCircle, MapPin, Calendar, Phone } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'

interface OrderStatusHistory {
  id: string
  status: string
  note?: string
  createdAt: string
}

interface Order {
  id: string
  status: string
  total: number
  createdAt: string
  trackingNumber?: string
  courier?: string
  estimatedDelivery?: string
  actualDelivery?: string
  deliveryNotes?: string
  trackingUrl?: string
  statusHistory: OrderStatusHistory[]
  items: {
    id: string
    product: {
      name: string
      image?: string
    }
    quantity: number
    price: number
  }[]
  shippingAddress?: {
    name: string
    address: string
    city: string
    postalCode: string
    country: string
    phone?: string
  }
}

export default function TrackOrderClient() {
  const [orderNumber, setOrderNumber] = useState('')
  const [email, setEmail] = useState('')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const t = useTranslations()
  const locale = useLocale()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!orderNumber || !email) {
      setError('Proszę podać numer zamówienia i email')
      return
    }

    setLoading(true)
    setError('')
    setOrder(null)

    try {
      const response = await fetch('/api/orders/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderNumber,
          email
        })
      })

      const data = await response.json()

      if (response.ok) {
        setOrder(data.order)
      } else {
        setError(data.error || 'Nie znaleziono zamówienia')
      }
    } catch (error) {
      setError('Wystąpił błąd podczas wyszukiwania zamówienia')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'CONFIRMED':
        return <CheckCircle className="h-5 w-5 text-blue-500" />
      case 'PROCESSING':
        return <Package className="h-5 w-5 text-blue-500" />
      case 'SHIPPED':
        return <Truck className="h-5 w-5 text-purple-500" />
      case 'DELIVERED':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'CANCELLED':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'PENDING': 'Oczekuje',
      'CONFIRMED': 'Potwierdzone',
      'PROCESSING': 'W przygotowaniu',
      'SHIPPED': 'Wysłane',
      'DELIVERED': 'Dostarczone',
      'CANCELLED': 'Anulowane'
    }
    return labels[status] || status
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800'
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800'
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800'
      case 'DELIVERED':
        return 'bg-green-100 text-green-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-tulinki-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-tulinki-warm mb-2">Śledzenie zamówienia</h1>
          <p className="text-tulinki-soft">
            Sprawdź status swojego zamówienia podając numer zamówienia i email
          </p>
        </div>

        {/* Formularz wyszukiwania */}
        <div className="bg-white rounded-lg shadow-sm border border-tulinki-rose/20 p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-tulinki-warm mb-2">
                  Numer zamówienia *
                </label>
                <input
                  type="text"
                  required
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="np. ORD-123456"
                  className="w-full px-3 py-2 border border-tulinki-rose/30 rounded-lg focus:ring-2 focus:ring-tulinki-rose focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-tulinki-warm mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="twoj@email.com"
                  className="w-full px-3 py-2 border border-tulinki-rose/30 rounded-lg focus:ring-2 focus:ring-tulinki-rose focus:border-transparent"
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto flex items-center justify-center px-6 py-3 bg-tulinki-burgundy text-white rounded-lg hover:bg-tulinki-wine disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              {loading ? 'Wyszukiwanie...' : 'Sprawdź status'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          )}
        </div>

        {/* Wyniki śledzenia */}
        {order && (
          <div className="space-y-6">
            {/* Podstawowe informacje o zamówieniu */}
            <div className="bg-white rounded-lg shadow-sm border border-tulinki-rose/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-tulinki-warm">
                  Zamówienie #{order.id}
                </h2>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="ml-2">{getStatusLabel(order.status)}</span>
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-tulinki-soft">Data zamówienia:</span>
                  <p className="font-medium">{new Date(order.createdAt).toLocaleDateString('pl-PL')}</p>
                </div>
                <div>
                  <span className="text-tulinki-soft">Wartość:</span>
                  <p className="font-medium">{order.total.toFixed(2)} zł</p>
                </div>
                {order.trackingNumber && (
                  <div>
                    <span className="text-tulinki-soft">Numer śledzenia:</span>
                    <p className="font-medium">{order.trackingNumber}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Informacje o dostawie */}
            {(order.trackingNumber || order.courier || order.estimatedDelivery) && (
              <div className="bg-white rounded-lg shadow-sm border border-tulinki-rose/20 p-6">
                <h3 className="text-lg font-semibold text-tulinki-warm mb-4 flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Informacje o dostawie
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {order.courier && (
                    <div>
                      <span className="text-tulinki-soft text-sm">Kurier:</span>
                      <p className="font-medium">{order.courier}</p>
                    </div>
                  )}
                  {order.estimatedDelivery && (
                    <div>
                      <span className="text-tulinki-soft text-sm">Szacowana dostawa:</span>
                      <p className="font-medium">{new Date(order.estimatedDelivery).toLocaleDateString('pl-PL')}</p>
                    </div>
                  )}
                  {order.actualDelivery && (
                    <div>
                      <span className="text-tulinki-soft text-sm">Dostarczone:</span>
                      <p className="font-medium text-green-600">{new Date(order.actualDelivery).toLocaleDateString('pl-PL')}</p>
                    </div>
                  )}
                  {order.trackingUrl && (
                    <div className="md:col-span-2">
                      <a
                        href={order.trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-tulinki-burgundy hover:text-tulinki-wine transition-colors"
                      >
                        <MapPin className="h-4 w-4 mr-1" />
                        Śledź na stronie kuriera
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Historia statusów */}
            <div className="bg-white rounded-lg shadow-sm border border-tulinki-rose/20 p-6">
              <h3 className="text-lg font-semibold text-tulinki-warm mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Historia statusów
              </h3>
              
              <div className="space-y-4">
                {order.statusHistory.map((status, index) => (
                  <div key={status.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {getStatusIcon(status.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-tulinki-warm">
                          {getStatusLabel(status.status)}
                        </p>
                        <p className="text-xs text-tulinki-soft">
                          {new Date(status.createdAt).toLocaleString('pl-PL')}
                        </p>
                      </div>
                      {status.note && (
                        <p className="text-sm text-tulinki-soft mt-1">{status.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Produkty w zamówieniu */}
            <div className="bg-white rounded-lg shadow-sm border border-tulinki-rose/20 p-6">
              <h3 className="text-lg font-semibold text-tulinki-warm mb-4 flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Produkty w zamówieniu
              </h3>
              
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-3 bg-tulinki-beige rounded-lg">
                    {item.product.image && (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-tulinki-warm">{item.product.name}</p>
                      <p className="text-sm text-tulinki-soft">
                        Ilość: {item.quantity} × {item.price.toFixed(2)} zł
                      </p>
                    </div>
                    <p className="font-semibold text-tulinki-burgundy">
                      {(item.quantity * item.price).toFixed(2)} zł
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Adres dostawy */}
            {order.shippingAddress && (
              <div className="bg-white rounded-lg shadow-sm border border-tulinki-rose/20 p-6">
                <h3 className="text-lg font-semibold text-tulinki-warm mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Adres dostawy
                </h3>
                
                <div className="text-sm">
                  <p className="font-medium">{order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>{order.shippingAddress.postalCode} {order.shippingAddress.city}</p>
                  <p>{order.shippingAddress.country}</p>
                  {order.shippingAddress.phone && (
                    <p className="flex items-center mt-2">
                      <Phone className="h-4 w-4 mr-1" />
                      {order.shippingAddress.phone}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
