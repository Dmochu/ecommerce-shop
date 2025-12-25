'use client'

import { useState, useEffect } from 'react'
import { 
  Mail, 
  Plus, 
  Users, 
  Send, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  BarChart3,
  Target,
  TrendingUp
} from 'lucide-react'

interface NewsletterSubscriber {
  id: string
  email: string
  firstName?: string
  lastName?: string
  isActive: boolean
  source?: string
  subscribedAt: string
  unsubscribedAt?: string
  emailCount: number
  lastEmailSent?: string
  user?: {
    name?: string
  }
}

interface NewsletterCampaign {
  id: string
  name: string
  subject: string
  status: 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'SENT' | 'FAILED'
  scheduledAt?: string
  sentAt?: string
  recipientCount: number
  sentCount: number
  openedCount: number
  clickedCount: number
  errorCount: number
  createdAt: string
}

interface NewsletterStats {
  totalSubscribers: number
  activeSubscribers: number
  unsubscribedCount: number
  totalCampaigns: number
  sentCampaigns: number
  totalEmailsSent: number
  averageOpenRate: number
  averageClickRate: number
}

export default function NewsletterClient() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([])
  const [campaigns, setCampaigns] = useState<NewsletterCampaign[]>([])
  const [stats, setStats] = useState<NewsletterStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'subscribers' | 'campaigns' | 'templates'>('subscribers')
  const [showCreateCampaign, setShowCreateCampaign] = useState(false)
  const [filters, setFilters] = useState({
    status: 'all',
    search: ''
  })

  useEffect(() => {
    fetchData()
  }, [activeTab, filters])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      if (activeTab === 'subscribers') {
        const response = await fetch(`/api/admin/newsletter/subscribers?${new URLSearchParams(filters)}`)
        const data = await response.json()
        setSubscribers(data.subscribers || [])
      } else if (activeTab === 'campaigns') {
        const response = await fetch(`/api/admin/newsletter/campaigns?${new URLSearchParams(filters)}`)
        const data = await response.json()
        setCampaigns(data.campaigns || [])
      }
      
      // Fetch stats
      const statsResponse = await fetch('/api/admin/newsletter/stats')
      const statsData = await statsResponse.json()
      setStats(statsData)
    } catch (error) {
      console.error('Error fetching newsletter data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSubscriber = async (subscriberId: string) => {
    if (!confirm('Czy na pewno chcesz usunąć tego subskrybenta?')) return

    try {
      const response = await fetch(`/api/admin/newsletter/subscribers/${subscriberId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchData()
      } else {
        const error = await response.json()
        alert(error.error || 'Błąd podczas usuwania subskrybenta')
      }
    } catch (error) {
      console.error('Error deleting subscriber:', error)
      alert('Błąd podczas usuwania subskrybenta')
    }
  }

  const handleToggleSubscriber = async (subscriberId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/newsletter/subscribers/${subscriberId}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive })
      })

      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error('Error toggling subscriber:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SENT': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'SENDING': return <Clock className="h-4 w-4 text-blue-500" />
      case 'SCHEDULED': return <Calendar className="h-4 w-4 text-yellow-500" />
      case 'FAILED': return <XCircle className="h-4 w-4 text-red-500" />
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'Szkic'
      case 'SCHEDULED': return 'Zaplanowana'
      case 'SENDING': return 'Wysyłana'
      case 'SENT': return 'Wysłana'
      case 'FAILED': return 'Błąd'
      default: return status
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Zarządzanie newsletterem</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowCreateCampaign(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nowa kampania
          </button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm text-gray-600">Aktywni subskrybenci</p>
                <p className="text-2xl font-bold">{stats.activeSubscribers}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <Send className="h-8 w-8 text-green-500" />
              <div className="ml-3">
                <p className="text-sm text-gray-600">Wysłane emaile</p>
                <p className="text-2xl font-bold">{stats.totalEmailsSent}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-purple-500" />
              <div className="ml-3">
                <p className="text-sm text-gray-600">Średnia otwartość</p>
                <p className="text-2xl font-bold">{stats.averageOpenRate.toFixed(1)}%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-orange-500" />
              <div className="ml-3">
                <p className="text-sm text-gray-600">Średnia klikalność</p>
                <p className="text-2xl font-bold">{stats.averageClickRate.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('subscribers')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'subscribers'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Subskrybenci
            </button>
            <button
              onClick={() => setActiveTab('campaigns')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'campaigns'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Kampanie
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'templates'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Szablony
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Filters */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Szukaj..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-2">
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Wszystkie</option>
                  {activeTab === 'subscribers' ? (
                    <>
                      <option value="active">Aktywni</option>
                      <option value="inactive">Nieaktywni</option>
                    </>
                  ) : (
                    <>
                      <option value="draft">Szkice</option>
                      <option value="scheduled">Zaplanowane</option>
                      <option value="sent">Wysłane</option>
                    </>
                  )}
                </select>
              </div>
            </div>
          </div>

          {/* Content */}
          {activeTab === 'subscribers' && (
            <div className="space-y-4">
              {subscribers.map((subscriber) => (
                <div key={subscriber.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{subscriber.email}</p>
                        <p className="text-sm text-gray-500">
                          {subscriber.firstName && subscriber.lastName 
                            ? `${subscriber.firstName} ${subscriber.lastName}`
                            : subscriber.user?.name || 'Brak nazwy'
                          }
                        </p>
                        <p className="text-xs text-gray-400">
                          Zapisał się: {formatDate(subscriber.subscribedAt)}
                          {subscriber.source && ` • Źródło: ${subscriber.source}`}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      subscriber.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {subscriber.isActive ? 'Aktywny' : 'Nieaktywny'}
                    </span>
                    
                    <button
                      onClick={() => handleToggleSubscriber(subscriber.id, subscriber.isActive)}
                      className={`p-2 rounded-lg transition-colors ${
                        subscriber.isActive 
                          ? 'text-red-600 hover:bg-red-50' 
                          : 'text-green-600 hover:bg-green-50'
                      }`}
                    >
                      {subscriber.isActive ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                    </button>
                    
                    <button
                      onClick={() => handleDeleteSubscriber(subscriber.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'campaigns' && (
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Send className="h-5 w-5 text-gray-400" />
                      <div>
                        <h3 className="font-medium text-gray-900">{campaign.name}</h3>
                        <p className="text-sm text-gray-500">{campaign.subject}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(campaign.status)}
                      <span className="text-sm font-medium">
                        {getStatusText(campaign.status)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Odbiorcy:</span> {campaign.recipientCount}
                    </div>
                    <div>
                      <span className="font-medium">Wysłane:</span> {campaign.sentCount}
                    </div>
                    <div>
                      <span className="font-medium">Otwarte:</span> {campaign.openedCount}
                    </div>
                    <div>
                      <span className="font-medium">Kliknięcia:</span> {campaign.clickedCount}
                    </div>
                  </div>
                  
                  {campaign.scheduledAt && (
                    <p className="text-xs text-gray-400 mt-2">
                      Zaplanowana na: {formatDate(campaign.scheduledAt)}
                    </p>
                  )}
                  
                  {campaign.sentAt && (
                    <p className="text-xs text-gray-400 mt-2">
                      Wysłana: {formatDate(campaign.sentAt)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="text-center py-12">
              <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Zarządzanie szablonami będzie dostępne wkrótce</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
