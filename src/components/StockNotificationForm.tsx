'use client'

import { useState } from 'react'
import { Bell, Mail, CheckCircle, AlertCircle } from 'lucide-react'

interface StockNotificationFormProps {
  productId: string
  productName: string
  stock: number
}

export default function StockNotificationForm({ 
  productId, 
  productName, 
  stock 
}: StockNotificationFormProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || loading) return

    setLoading(true)
    setStatus('idle')

    try {
      const response = await fetch('/api/stock-notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          email
        })
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage('Dziękujemy! Powiadomimy Cię gdy produkt będzie dostępny.')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Wystąpił błąd. Spróbuj ponownie.')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Wystąpił błąd. Spróbuj ponownie.')
    } finally {
      setLoading(false)
    }
  }

  // Nie pokazuj formularza jeśli produkt jest dostępny
  if (stock > 0) {
    return null
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
      <div className="flex items-start space-x-3">
        <Bell className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            Produkt niedostępny
          </h3>
          <p className="text-sm text-blue-700 mb-3">
            {productName} jest obecnie niedostępny. Powiadomimy Cię gdy będzie w magazynie.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="notification-email" className="block text-sm font-medium text-blue-900 mb-1">
                Adres email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
                <input
                  id="notification-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="twoj@email.com"
                  className="w-full pl-10 pr-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading || !email}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <Bell className="h-4 w-4 mr-2" />
                  Powiadom mnie
                </>
              )}
            </button>
          </form>
          
          {/* Status messages */}
          {status === 'success' && (
            <div className="mt-3 flex items-center space-x-2 text-green-700">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">{message}</span>
            </div>
          )}
          
          {status === 'error' && (
            <div className="mt-3 flex items-center space-x-2 text-red-700">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{message}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
