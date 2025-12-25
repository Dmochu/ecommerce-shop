'use client'

import { useState, useEffect } from 'react'
import { 
  Bell, 
  Mail, 
  Calendar, 
  User, 
  Package,
  Send,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'

interface StockNotification {
  id: string
  productId: string
  email: string
  notified: boolean
  createdAt: string
  notifiedAt?: string
  product: {
    id: string
    name: string
    price: number
    image?: string
    stock: number
  }
  user?: {
    name: string | null
    email: string
  }
}

interface NotificationStats {
  total: number
  pending: number
  sent: number
  today: number
}

export default function StockNotificationsClient() {
  const [notifications, setNotifications] = useState<StockNotification[]>([])
  const [stats, setStats] = useState<NotificationStats>({
    total: 0,
    pending: 0,
    sent: 0,
    today: 0
  })
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [filters, setFilters] = useState({
    status: 'all', // all, pending, sent
    search: ''
  })

  useEffect(() => {
    fetchNotifications()
    fetchStats()
  }, [filters])

  const fetchNotifications = async () => {
    try {
      const params = new URLSearchParams()
      if (filters.status !== 'all') params.append('status', filters.status)
      if (filters.search) params.append('search', filters.search)

      const response = await fetch(`/api/admin/stock-notifications?${params}`)
      const data = await response.json()
      setNotifications(data.notifications || [])
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stock-notifications/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleSendNotifications = async () => {
    setSending(true)
    try {
      const response = await fetch('/api/admin/stock-notifications/send', {
        method: 'POST'
      })
      
      const data = await response.json()
      
      if (response.ok) {
        alert(`Wysłano ${data.sent} powiadomień dla ${data.availableProducts} produktów`)
        fetchNotifications()
        fetchStats()
      } else {
        alert('Błąd podczas wysyłania powiadomień')
      }
    } catch (error) {
      console.error('Error sending notifications:', error)
      alert('Błąd podczas wysyłania powiadomień')
    } finally {
      setSending(false)
    }
  }

  const handleTestCron = async () => {
    try {
      const response = await fetch('/api/cron/stock-notifications', {
        method: 'GET'
      })
      
      const data = await response.json()
      
      if (response.ok) {
        alert(`Test cron job: wysłano ${data.result.sent} powiadomień`)
        fetchNotifications()
        fetchStats()
      } else {
        alert('Błąd podczas testowania cron job')
      }
    } catch (error) {
      console.error('Error testing cron:', error)
      alert('Błąd podczas testowania cron job')
    }
  }

  const getStatusBadge = (notification: StockNotification) => {
    if (notification.notified) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Wysłane
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <Bell className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Wszystkie</p>
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
              <p className="text-sm font-medium text-gray-500">Wysłane</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.sent}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Dzisiaj</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.today}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Akcje */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Akcje</h3>
          <div className="flex space-x-3">
            <button
              onClick={handleSendNotifications}
              disabled={sending}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {sending ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              {sending ? 'Wysyłanie...' : 'Wyślij powiadomienia'}
            </button>
            
            <button
              onClick={handleTestCron}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Test Cron Job
            </button>
          </div>
        </div>
      </div>

      {/* Filtry */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <option value="sent">Wysłane</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Szukaj
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              placeholder="Szukaj po email lub produkcie..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-tulinki-rose focus:border-transparent"
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => setFilters({status: 'all', search: ''})}
              className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Wyczyść filtry
            </button>
          </div>
        </div>
      </div>

      {/* Lista powiadomień */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Powiadomienia ({notifications.length})
          </h3>
        </div>
        
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Brak powiadomień do wyświetlenia</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <li key={notification.id} className="px-4 py-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="flex-shrink-0">
                        {notification.product.image ? (
                          <img
                            src={notification.product.image}
                            alt={notification.product.name}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Package className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {notification.product.name}
                          </h4>
                          {getStatusBadge(notification)}
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            {notification.email}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(notification.createdAt).toLocaleDateString('pl-PL')}
                          </div>
                          {notification.notifiedAt && (
                            <div className="flex items-center text-green-600">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Wysłane: {new Date(notification.notifiedAt).toLocaleDateString('pl-PL')}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Cena:</span> {notification.product.price.toFixed(2)} zł
                      <span className="mx-2">•</span>
                      <span className="font-medium">Stan:</span> {notification.product.stock} szt.
                    </div>
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
