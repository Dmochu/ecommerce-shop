'use client'

import { useState } from 'react'
import { Mail, CheckCircle, AlertCircle, Loader } from 'lucide-react'

interface NewsletterFormProps {
  source?: string
  showFirstName?: boolean
  showLastName?: boolean
  className?: string
  variant?: 'default' | 'compact' | 'inline'
}

export default function NewsletterForm({ 
  source = 'homepage',
  showFirstName = false,
  showLastName = false,
  className = '',
  variant = 'default'
}: NewsletterFormProps) {
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setMessage('Proszę podać adres email')
      setIsSuccess(false)
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          firstName: showFirstName ? firstName.trim() : undefined,
          lastName: showLastName ? lastName.trim() : undefined,
          source
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Dziękujemy za zapisanie się do newslettera!')
        setIsSuccess(true)
        setEmail('')
        setFirstName('')
        setLastName('')
      } else {
        setMessage(data.error || 'Wystąpił błąd podczas zapisywania')
        setIsSuccess(false)
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error)
      setMessage('Wystąpił błąd podczas zapisywania')
      setIsSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  if (variant === 'compact') {
    return (
      <div className={`bg-white p-4 rounded-lg shadow ${className}`}>
        <div className="flex items-center space-x-2 mb-3">
          <Mail className="h-5 w-5 text-blue-600" />
          <h3 className="font-medium text-gray-900">Newsletter</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Twój email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm flex items-center justify-center"
          >
            {loading ? (
              <Loader className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Mail className="h-4 w-4 mr-2" />
            )}
            Zapisz się
          </button>
        </form>
        
        {message && (
          <div className={`mt-3 flex items-center text-sm ${
            isSuccess ? 'text-green-600' : 'text-red-600'
          }`}>
            {isSuccess ? (
              <CheckCircle className="h-4 w-4 mr-1" />
            ) : (
              <AlertCircle className="h-4 w-4 mr-1" />
            )}
            {message}
          </div>
        )}
      </div>
    )
  }

  if (variant === 'inline') {
    return (
      <div className={className}>
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Twój email"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm flex items-center"
          >
            {loading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              'Zapisz się'
            )}
          </button>
        </form>
        
        {message && (
          <div className={`mt-2 flex items-center text-sm ${
            isSuccess ? 'text-green-600' : 'text-red-600'
          }`}>
            {isSuccess ? (
              <CheckCircle className="h-4 w-4 mr-1" />
            ) : (
              <AlertCircle className="h-4 w-4 mr-1" />
            )}
            {message}
          </div>
        )}
      </div>
    )
  }

  // Default variant
  return (
    <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg ${className}`}>
      <div className="text-center mb-6">
        <Mail className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Zapisz się do newslettera
        </h3>
        <p className="text-gray-600">
          Otrzymuj najnowsze informacje o produktach, promocjach i ofertach specjalnych
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {showFirstName && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imię (opcjonalne)
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Twoje imię"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
          
          {showLastName && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nazwisko (opcjonalne)
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Twoje nazwisko"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Adres email *
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="twoj@email.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
        >
          {loading ? (
            <Loader className="h-5 w-5 animate-spin mr-2" />
          ) : (
            <Mail className="h-5 w-5 mr-2" />
          )}
          Zapisz się do newslettera
        </button>
        
        <p className="text-xs text-gray-500 text-center">
          Możesz wypisać się w każdej chwili. Nie spamujemy!
        </p>
      </form>
      
      {message && (
        <div className={`mt-4 p-3 rounded-lg flex items-center ${
          isSuccess 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {isSuccess ? (
            <CheckCircle className="h-5 w-5 mr-2" />
          ) : (
            <AlertCircle className="h-5 w-5 mr-2" />
          )}
          {message}
        </div>
      )}
    </div>
  )
}
