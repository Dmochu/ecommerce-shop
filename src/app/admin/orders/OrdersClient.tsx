'use client'

import Link from 'next/link'
import { Eye, ShoppingBag, CheckCircle, XCircle, Truck, Package } from 'lucide-react'
import { useState } from 'react'

interface Order {
  id: string
  total: number
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  createdAt: Date
  user: {
    name: string | null
    email: string
  } | null
  guestEmail: string | null
  guestName: string | null
  items: Array<{
    id: string
    quantity: number
    product: {
      name: string
    }
  }>
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

const nextStatusActions = {
  PENDING: { label: 'Potwierdź', status: 'CONFIRMED', icon: CheckCircle, color: 'bg-blue-600 hover:bg-blue-700' },
  CONFIRMED: { label: 'Wyślij', status: 'SHIPPED', icon: Truck, color: 'bg-purple-600 hover:bg-purple-700' },
  SHIPPED: { label: 'Dostarczono', status: 'DELIVERED', icon: Package, color: 'bg-green-600 hover:bg-green-700' }
}

export default function OrdersClient({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders)
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const [updateMessage, setUpdateMessage] = useState('')

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setIsUpdating(orderId)
    setUpdateMessage('')

    try {
      // Symulacja aktualizacji w bazie danych
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Aktualizuj status zamówienia lokalnie
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus as Order['status'] }
          : order
      ))
      
      const statusLabel = orderStatusLabels[newStatus as keyof typeof orderStatusLabels]
      setUpdateMessage(`Status zamówienia został zmieniony na: ${statusLabel}`)
      setTimeout(() => setUpdateMessage(''), 3000)
    } catch (error) {
      setUpdateMessage('Błąd podczas aktualizacji statusu!')
      setTimeout(() => setUpdateMessage(''), 3000)
    } finally {
      setIsUpdating(null)
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Zarządzanie Zamówieniami</h1>
          <p className="mt-2 text-gray-600">Przeglądaj i zarządzaj zamówieniami klientów</p>
        </div>
      </div>

      {/* Update Message */}
      {updateMessage && (
        <div className={`mb-4 p-4 rounded-lg ${
          updateMessage.includes('Błąd') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {updateMessage}
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Zamówienie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Klient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kwota
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Akcje
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => {
                const nextAction = nextStatusActions[order.status as keyof typeof nextStatusActions]
                const ActionIcon = nextAction?.icon || CheckCircle
                
                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #{order.id.slice(-8).toUpperCase()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.items.length} produktów
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.user ? (order.user.name || 'Brak nazwy') : (order.guestName || 'Gość')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.user ? order.user.email : order.guestEmail}
                      </div>
                      {!order.user && (
                        <div className="mt-1">
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                            Gość
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${orderStatusColors[order.status]}`}>
                        {orderStatusLabels[order.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.total.toFixed(2)} zł
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('pl-PL')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                          title="Szczegóły zamówienia"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        {nextAction && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, nextAction.status)}
                            disabled={isUpdating === order.id}
                            className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium text-white transition-colors disabled:opacity-50 ${nextAction.color}`}
                            title={nextAction.label}
                          >
                            {isUpdating === order.id ? (
                              <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                            ) : (
                              <ActionIcon className="h-3 w-3 mr-1" />
                            )}
                            {nextAction.label}
                          </button>
                        )}
                        {order.status === 'PENDING' && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, 'CANCELLED')}
                            disabled={isUpdating === order.id}
                            className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50"
                            title="Anuluj zamówienie"
                          >
                            {isUpdating === order.id ? (
                              <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                            ) : (
                              <XCircle className="h-3 w-3 mr-1" />
                            )}
                            Anuluj
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Brak zamówień</h3>
            <p className="mt-1 text-sm text-gray-500">Jeszcze nie ma żadnych zamówień w systemie.</p>
          </div>
        )}
      </div>
    </div>
  )
}
