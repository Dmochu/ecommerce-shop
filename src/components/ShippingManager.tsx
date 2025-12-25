'use client'

import { useState, useEffect } from 'react'
import { Package, Truck, Download, Eye } from 'lucide-react'

interface ShippingService {
  id: string
  name: string
  price: number
  estimatedDelivery: string
}

interface Shipment {
  id: string
  trackingNumber: string
  status: string
  createdAt: string
  labelUrl?: string
}

export default function ShippingManager() {
  const [services, setServices] = useState<ShippingService[]>([])
  const [selectedService, setSelectedService] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Pobierz dostępne usługi kurierskie
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/shipping/services')
        const data = await response.json()
        
        if (data.success) {
          setServices(data.services)
        }
      } catch (error) {
        console.error('Error fetching services:', error)
      }
    }

    fetchServices()
  }, [])

  // Utwórz przesyłkę
  const createShipment = async (orderId: string) => {
    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/shipping/create-shipment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ orderId })
      })

      const data = await response.json()

      if (data.success) {
        setMessage('Przesyłka została utworzona pomyślnie!')
        // Można dodać logikę do pobrania etykiety
      } else {
        setMessage(`Błąd: ${data.error}`)
      }
    } catch (error) {
      setMessage('Wystąpił błąd podczas tworzenia przesyłki')
    } finally {
      setIsLoading(false)
    }
  }

  // Sprawdź status przesyłki
  const trackShipment = async (trackingNumber: string) => {
    try {
      const response = await fetch(`/api/shipping/track-shipment?trackingNumber=${trackingNumber}`)
      const data = await response.json()
      
      if (data.success) {
        console.log('Shipment status:', data.status)
        // Można dodać modal z informacjami o statusie
      }
    } catch (error) {
      console.error('Error tracking shipment:', error)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Zarządzanie przesyłkami</h2>
        <Package className="h-6 w-6 text-blue-600" />
      </div>

      {/* Dostępne usługi kurierskie */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Dostępne usługi kurierskie</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="border rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer"
              onClick={() => setSelectedService(service.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{service.name}</h4>
                  <p className="text-sm text-gray-600">{service.estimatedDelivery}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-blue-600">{service.price} zł</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Akcje */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => createShipment('example-order-id')}
            disabled={isLoading}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Truck className="h-4 w-4" />
            <span>{isLoading ? 'Tworzenie...' : 'Utwórz przesyłkę'}</span>
          </button>

          <button
            onClick={() => trackShipment('example-tracking-number')}
            className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            <Eye className="h-4 w-4" />
            <span>Sprawdź status</span>
          </button>

          <button
            onClick={() => window.open('example-label-url', '_blank')}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            <Download className="h-4 w-4" />
            <span>Pobierz etykietę</span>
          </button>
        </div>

        {message && (
          <div className={`p-3 rounded-lg ${
            message.includes('Błąd') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {message}
          </div>
        )}
      </div>

      {/* Informacje o konfiguracji */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Konfiguracja API Apaczki</h4>
        <p className="text-sm text-gray-600">
          Aby korzystać z API Apaczki, dodaj następujące zmienne środowiskowe do pliku .env:
        </p>
        <pre className="mt-2 text-xs bg-gray-100 p-2 rounded">
{`APACZKA_API_URL="https://api.apaczka.pl"
APACZKA_API_KEY="your-apaczka-api-key"
APACZKA_USERNAME="your-apaczka-username"
APACZKA_PASSWORD="your-apaczka-password"`}
        </pre>
      </div>
    </div>
  )
}
