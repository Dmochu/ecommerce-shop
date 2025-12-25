'use client'

import Link from 'next/link'
import { ArrowLeft, User, MapPin, Package, CreditCard, Calendar, Phone, Mail } from 'lucide-react'
import { useState } from 'react'

interface OrderItem {
  id: string
  quantity: number
  price: number
  product: {
    id: string
    name: string
    price: number
    image: string
  }
}

interface ShippingAddress {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  country: string
}

interface Order {
  id: string
  total: number
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'
  createdAt: Date
  updatedAt: Date
  user: {
    id: string
    name: string | null
    email: string
  } | null
  guestEmail: string | null
  guestName: string | null
  items: OrderItem[]
  shippingAddress: ShippingAddress | null
}

const orderStatusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800'
}

const orderStatusLabels = {
  PENDING: 'Oczekujące',
  CONFIRMED: 'Potwierdzone',
  SHIPPED: 'Wysłane',
  DELIVERED: 'Dostarczone',
  CANCELLED: 'Anulowane'
}

const paymentStatusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PAID: 'bg-green-100 text-green-800',
  FAILED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-gray-100 text-gray-800'
}

const paymentStatusLabels = {
  PENDING: 'Oczekujące',
  PAID: 'Opłacone',
  FAILED: 'Nieudane',
  REFUNDED: 'Zwrócone'
}

export default function OrderDetailsClient({ order }: { order: Order }) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateMessage, setUpdateMessage] = useState('')

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true)
    setUpdateMessage('')

    try {
      // Symulacja aktualizacji w bazie danych
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const statusLabel = orderStatusLabels[newStatus as keyof typeof orderStatusLabels]
      setUpdateMessage(`Status zamówienia został zmieniony na: ${statusLabel}`)
      setTimeout(() => setUpdateMessage(''), 3000)
    } catch (error) {
      setUpdateMessage('Błąd podczas aktualizacji statusu!')
      setTimeout(() => setUpdateMessage(''), 3000)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/orders"
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Powrót do zamówień
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Zamówienie #{order.id.slice(-8).toUpperCase()}
            </h1>
            <p className="mt-2 text-gray-600">
              Szczegóły zamówienia z {new Date(order.createdAt).toLocaleDateString('pl-PL')}
            </p>
          </div>
        </div>
      </div>

      {/* Update Message */}
      {updateMessage && (
        <div className={`mb-6 p-4 rounded-lg ${
          updateMessage.includes('Błąd') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {updateMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Status Zamówienia</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${orderStatusColors[order.status]}`}>
                  {orderStatusLabels[order.status]}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${paymentStatusColors[order.paymentStatus]}`}>
                  {paymentStatusLabels[order.paymentStatus]}
                </span>
              </div>
              <div className="flex space-x-2">
                {order.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate('CONFIRMED')}
                      disabled={isUpdating}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {isUpdating ? 'Aktualizuję...' : 'Potwierdź'}
                    </button>
                    <button
                      onClick={() => handleStatusUpdate('CANCELLED')}
                      disabled={isUpdating}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      Anuluj
                    </button>
                  </>
                )}
                {order.status === 'CONFIRMED' && (
                  <button
                    onClick={() => handleStatusUpdate('SHIPPED')}
                    disabled={isUpdating}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                  >
                    {isUpdating ? 'Aktualizuję...' : 'Wyślij'}
                  </button>
                )}
                {order.status === 'SHIPPED' && (
                  <button
                    onClick={() => handleStatusUpdate('DELIVERED')}
                    disabled={isUpdating}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {isUpdating ? 'Aktualizuję...' : 'Dostarczono'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Produkty w Zamówieniu</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                    <p className="text-sm text-gray-500">
                      Ilość: {item.quantity} × {item.price.toFixed(2)} zł
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {(item.quantity * item.price).toFixed(2)} zł
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Razem:</span>
                <span>{order.total.toFixed(2)} zł</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Informacje o Kliencie
            </h2>
            <div className="space-y-3">
              {order.user ? (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Imię i nazwisko</p>
                    <p className="font-medium text-gray-900">
                      {order.user.name || 'Brak nazwy'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{order.user.email}</p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Imię i nazwisko (gość)</p>
                    <p className="font-medium text-gray-900">
                      {order.guestName || 'Brak nazwy'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email (gość)</p>
                    <p className="font-medium text-gray-900">{order.guestEmail}</p>
                  </div>
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      Zamówienie gościa
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Adres Dostawy
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Imię i nazwisko</p>
                  <p className="font-medium text-gray-900">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{order.shippingAddress.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Telefon</p>
                  <p className="font-medium text-gray-900">{order.shippingAddress.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Adres</p>
                  <p className="font-medium text-gray-900">{order.shippingAddress.address}</p>
                  <p className="font-medium text-gray-900">
                    {order.shippingAddress.postalCode} {order.shippingAddress.city}
                  </p>
                  <p className="font-medium text-gray-900">{order.shippingAddress.country}</p>
                </div>
              </div>
            </div>
          )}

          {/* Order Details */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Szczegóły Zamówienia
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Numer zamówienia</p>
                <p className="font-medium text-gray-900">#{order.id.slice(-8).toUpperCase()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Data zamówienia</p>
                <p className="font-medium text-gray-900">
                  {new Date(order.createdAt).toLocaleDateString('pl-PL')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ostatnia aktualizacja</p>
                <p className="font-medium text-gray-900">
                  {new Date(order.updatedAt).toLocaleDateString('pl-PL')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Kwota całkowita</p>
                <p className="font-medium text-gray-900 text-lg">{order.total.toFixed(2)} zł</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
