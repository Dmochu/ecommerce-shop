'use client'

import { useState, useEffect } from 'react'
import { 
  Tag, 
  Plus, 
  Edit, 
  Trash2, 
  Copy, 
  Calendar,
  Users,
  Percent,
  DollarSign,
  Truck,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'

interface Coupon {
  id: string
  code: string
  name: string
  description?: string
  type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING'
  value: number
  minOrderValue?: number
  maxDiscount?: number
  usageLimit?: number
  usedCount: number
  validFrom?: string
  validUntil?: string
  isActive: boolean
  createdAt: string
  orders: {
    id: string
    total: number
    createdAt: string
  }[]
}

interface CouponStats {
  total: number
  active: number
  expired: number
  totalUsage: number
  totalDiscount: number
}

export default function CouponsClient() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [stats, setStats] = useState<CouponStats>({
    total: 0,
    active: 0,
    expired: 0,
    totalUsage: 0,
    totalDiscount: 0
  })
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)
  const [filters, setFilters] = useState({
    status: 'all', // all, active, expired, inactive
    search: ''
  })

  useEffect(() => {
    fetchCoupons()
    fetchStats()
  }, [filters])

  const fetchCoupons = async () => {
    try {
      const params = new URLSearchParams()
      if (filters.status !== 'all') params.append('status', filters.status)
      if (filters.search) params.append('search', filters.search)

      const response = await fetch(`/api/admin/coupons?${params}`)
      const data = await response.json()
      setCoupons(data.coupons || [])
    } catch (error) {
      console.error('Error fetching coupons:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/coupons/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleDeleteCoupon = async (couponId: string) => {
    if (!confirm('Czy na pewno chcesz usunąć ten kupon?')) return

    try {
      const response = await fetch(`/api/admin/coupons/${couponId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setCoupons(coupons.filter(coupon => coupon.id !== couponId))
        fetchStats()
      }
    } catch (error) {
      console.error('Error deleting coupon:', error)
    }
  }

  const handleToggleActive = async (couponId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/coupons/${couponId}/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: !isActive })
      })
      
      if (response.ok) {
        setCoupons(coupons.map(coupon => 
          coupon.id === couponId 
            ? { ...coupon, isActive: !isActive }
            : coupon
        ))
        fetchStats()
      }
    } catch (error) {
      console.error('Error toggling coupon:', error)
    }
  }

  const copyCouponCode = (code: string) => {
    navigator.clipboard.writeText(code)
    // Można dodać toast notification
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PERCENTAGE':
        return <Percent className="h-4 w-4" />
      case 'FIXED_AMOUNT':
        return <DollarSign className="h-4 w-4" />
      case 'FREE_SHIPPING':
        return <Truck className="h-4 w-4" />
      default:
        return <Tag className="h-4 w-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'PERCENTAGE':
        return 'Procentowy'
      case 'FIXED_AMOUNT':
        return 'Kwotowy'
      case 'FREE_SHIPPING':
        return 'Darmowa dostawa'
      default:
        return type
    }
  }

  const getStatusBadge = (coupon: Coupon) => {
    const now = new Date()
    
    if (!coupon.isActive) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <XCircle className="h-3 w-3 mr-1" />
          Nieaktywny
        </span>
      )
    }
    
    if (coupon.validUntil && new Date(coupon.validUntil) < now) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <Clock className="h-3 w-3 mr-1" />
          Wygasł
        </span>
      )
    }
    
    if (coupon.validFrom && new Date(coupon.validFrom) > now) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="h-3 w-3 mr-1" />
          Oczekuje
        </span>
      )
    }
    
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircle className="h-3 w-3 mr-1" />
        Aktywny
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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <Tag className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Wszystkie kupony</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Aktywne</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.active}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <XCircle className="h-8 w-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Wygasłe</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.expired}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Użycia</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalUsage}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Łączne rabaty</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalDiscount.toFixed(2)} zł</p>
            </div>
          </div>
        </div>
      </div>

      {/* Akcje */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Kupony</h3>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nowy kupon
          </button>
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
              <option value="active">Aktywne</option>
              <option value="expired">Wygasłe</option>
              <option value="inactive">Nieaktywne</option>
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
              placeholder="Szukaj po kodzie lub nazwie..."
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

      {/* Lista kuponów */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {coupons.length === 0 ? (
          <div className="text-center py-12">
            <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Brak kuponów do wyświetlenia</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {coupons.map((coupon) => (
              <div key={coupon.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(coupon.type)}
                        <span className="font-medium text-gray-900">{coupon.code}</span>
                        <button
                          onClick={() => copyCouponCode(coupon.code)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Kopiuj kod"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                      {getStatusBadge(coupon)}
                    </div>
                    
                    <h3 className="text-lg font-medium text-gray-900 mb-1">{coupon.name}</h3>
                    {coupon.description && (
                      <p className="text-sm text-gray-600 mb-2">{coupon.description}</p>
                    )}
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center">
                        <span className="mr-1">Typ:</span>
                        <span className="font-medium">{getTypeLabel(coupon.type)}</span>
                        {coupon.type !== 'FREE_SHIPPING' && (
                          <span className="ml-1">
                            ({coupon.type === 'PERCENTAGE' ? `${coupon.value}%` : `${coupon.value} zł`})
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{coupon.usedCount} / {coupon.usageLimit || '∞'} użyć</span>
                      </div>
                      
                      {coupon.validFrom && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Od: {new Date(coupon.validFrom).toLocaleDateString('pl-PL')}</span>
                        </div>
                      )}
                      
                      {coupon.validUntil && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Do: {new Date(coupon.validUntil).toLocaleDateString('pl-PL')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => setEditingCoupon(coupon)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Edytuj"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => handleToggleActive(coupon.id, coupon.isActive)}
                      className={`p-2 transition-colors ${
                        coupon.isActive 
                          ? 'text-green-600 hover:text-green-700' 
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                      title={coupon.isActive ? 'Dezaktywuj' : 'Aktywuj'}
                    >
                      {coupon.isActive ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                    </button>
                    
                    <button
                      onClick={() => handleDeleteCoupon(coupon.id)}
                      className="p-2 text-red-400 hover:text-red-600 transition-colors"
                      title="Usuń"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
