'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { User, Save, MapPin, Building, Mail, Phone, Calendar, Globe, Bell } from 'lucide-react'
import Link from 'next/link'

interface UserProfile {
  id: string
  email: string
  name?: string
  firstName?: string
  lastName?: string
  phone?: string
  dateOfBirth?: string
  gender?: string
  address?: string
  city?: string
  postalCode?: string
  country?: string
  isBusiness: boolean
  companyName?: string
  nip?: string
  regon?: string
  businessAddress?: string
  businessCity?: string
  businessPostalCode?: string
  newsletter: boolean
  smsMarketing: boolean
  preferredLanguage?: string
  timezone?: string
}

export default function ProfilePage() {
  const t = useTranslations('profile')
  const locale = useLocale()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [formData, setFormData] = useState<UserProfile>({
    id: '',
    email: '',
    name: '',
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Polska',
    isBusiness: false,
    companyName: '',
    nip: '',
    regon: '',
    businessAddress: '',
    businessCity: '',
    businessPostalCode: '',
    newsletter: false,
    smsMarketing: false,
    preferredLanguage: 'pl',
    timezone: 'Europe/Warsaw'
  })

  useEffect(() => {
    // Tutaj można dodać logikę pobierania danych użytkownika
    // Na razie symulujemy dane
    setUser({
      id: '1',
      email: 'user@example.com',
      name: 'Jan Kowalski',
      firstName: 'Jan',
      lastName: 'Kowalski',
      phone: '+48 123 456 789',
      dateOfBirth: '1990-01-01',
      gender: 'MALE',
      address: 'ul. Przykładowa 123',
      city: 'Warszawa',
      postalCode: '00-001',
      country: 'Polska',
      isBusiness: false,
      companyName: '',
      nip: '',
      regon: '',
      businessAddress: '',
      businessCity: '',
      businessPostalCode: '',
      newsletter: true,
      smsMarketing: false,
      preferredLanguage: 'pl',
      timezone: 'Europe/Warsaw'
    })
    setIsLoading(false)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      // Tutaj można dodać logikę zapisywania danych
      console.log('Saving profile:', formData)
      await new Promise(resolve => setTimeout(resolve, 1000)) // Symulacja zapisu
      alert('Profil został zaktualizowany!')
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Wystąpił błąd podczas zapisywania profilu')
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-tulinki-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tulinki-burgundy mx-auto mb-4"></div>
          <p className="text-tulinki-soft">Ładowanie profilu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-tulinki-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-tulinki-rose/20 p-8">
          <div className="mb-8">
            <Link 
              href={`/${locale}`}
              className="inline-flex items-center text-tulinki-burgundy hover:text-tulinki-wine mb-4"
            >
              ← Powrót do sklepu
            </Link>
            <h1 className="text-3xl font-bold text-tulinki-warm flex items-center gap-3">
              <User className="h-8 w-8" />
              Mój profil
            </h1>
            <p className="text-tulinki-soft mt-2">Zarządzaj swoimi danymi osobowymi i preferencjami</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Podstawowe dane osobowe */}
            <div className="bg-tulinki-beige/30 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-tulinki-warm mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                Dane osobowe
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-tulinki-warm mb-2">
                    Imię *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName || ''}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-3 py-2 border border-tulinki-rose/30 rounded-lg focus:ring-2 focus:ring-tulinki-rose focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-tulinki-warm mb-2">
                    Nazwisko *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName || ''}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-3 py-2 border border-tulinki-rose/30 rounded-lg focus:ring-2 focus:ring-tulinki-rose focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-tulinki-warm mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-tulinki-rose/30 rounded-lg focus:ring-2 focus:ring-tulinki-rose focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-tulinki-warm mb-2">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-tulinki-rose/30 rounded-lg focus:ring-2 focus:ring-tulinki-rose focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-tulinki-warm mb-2">
                    Data urodzenia
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth || ''}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className="w-full px-3 py-2 border border-tulinki-rose/30 rounded-lg focus:ring-2 focus:ring-tulinki-rose focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-tulinki-warm mb-2">
                    Płeć
                  </label>
                  <select
                    value={formData.gender || ''}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full px-3 py-2 border border-tulinki-rose/30 rounded-lg focus:ring-2 focus:ring-tulinki-rose focus:border-transparent"
                  >
                    <option value="">Wybierz płeć</option>
                    <option value="MALE">Mężczyzna</option>
                    <option value="FEMALE">Kobieta</option>
                    <option value="OTHER">Inna</option>
                    <option value="PREFER_NOT_TO_SAY">Wolę nie podawać</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Adres domowy */}
            <div className="bg-tulinki-beige/30 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-tulinki-warm mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Adres domowy
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-tulinki-warm mb-2">
                    Adres
                  </label>
                  <input
                    type="text"
                    value={formData.address || ''}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-3 py-2 border border-tulinki-rose/30 rounded-lg focus:ring-2 focus:ring-tulinki-rose focus:border-transparent"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-tulinki-warm mb-2">
                      Miasto
                    </label>
                    <input
                      type="text"
                      value={formData.city || ''}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full px-3 py-2 border border-tulinki-rose/30 rounded-lg focus:ring-2 focus:ring-tulinki-rose focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-tulinki-warm mb-2">
                      Kod pocztowy
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode || ''}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      className="w-full px-3 py-2 border border-tulinki-rose/30 rounded-lg focus:ring-2 focus:ring-tulinki-rose focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-tulinki-warm mb-2">
                      Kraj
                    </label>
                    <select
                      value={formData.country || 'Polska'}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      className="w-full px-3 py-2 border border-tulinki-rose/30 rounded-lg focus:ring-2 focus:ring-tulinki-rose focus:border-transparent"
                    >
                      <option value="Polska">Polska</option>
                      <option value="Niemcy">Niemcy</option>
                      <option value="Czechy">Czechy</option>
                      <option value="Słowacja">Słowacja</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Dane biznesowe */}
            <div className="bg-tulinki-beige/30 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-tulinki-warm mb-4 flex items-center gap-2">
                <Building className="h-5 w-5" />
                Dane biznesowe
              </h2>
              
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isBusiness}
                    onChange={(e) => handleInputChange('isBusiness', e.target.checked)}
                    className="h-4 w-4 text-tulinki-rose focus:ring-tulinki-rose border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-tulinki-warm">
                    Jestem firmą
                  </span>
                </label>
              </div>

              {formData.isBusiness && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-tulinki-warm mb-2">
                        Nazwa firmy *
                      </label>
                      <input
                        type="text"
                        value={formData.companyName || ''}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        className="w-full px-3 py-2 border border-tulinki-rose/30 rounded-lg focus:ring-2 focus:ring-tulinki-rose focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-tulinki-warm mb-2">
                        NIP
                      </label>
                      <input
                        type="text"
                        value={formData.nip || ''}
                        onChange={(e) => handleInputChange('nip', e.target.value)}
                        className="w-full px-3 py-2 border border-tulinki-rose/30 rounded-lg focus:ring-2 focus:ring-tulinki-rose focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-tulinki-warm mb-2">
                      REGON
                    </label>
                    <input
                      type="text"
                      value={formData.regon || ''}
                      onChange={(e) => handleInputChange('regon', e.target.value)}
                      className="w-full px-3 py-2 border border-tulinki-rose/30 rounded-lg focus:ring-2 focus:ring-tulinki-rose focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-tulinki-warm mb-2">
                      Adres firmy
                    </label>
                    <input
                      type="text"
                      value={formData.businessAddress || ''}
                      onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                      className="w-full px-3 py-2 border border-tulinki-rose/30 rounded-lg focus:ring-2 focus:ring-tulinki-rose focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-tulinki-warm mb-2">
                        Miasto firmy
                      </label>
                      <input
                        type="text"
                        value={formData.businessCity || ''}
                        onChange={(e) => handleInputChange('businessCity', e.target.value)}
                        className="w-full px-3 py-2 border border-tulinki-rose/30 rounded-lg focus:ring-2 focus:ring-tulinki-rose focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-tulinki-warm mb-2">
                        Kod pocztowy firmy
                      </label>
                      <input
                        type="text"
                        value={formData.businessPostalCode || ''}
                        onChange={(e) => handleInputChange('businessPostalCode', e.target.value)}
                        className="w-full px-3 py-2 border border-tulinki-rose/30 rounded-lg focus:ring-2 focus:ring-tulinki-rose focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Preferencje */}
            <div className="bg-tulinki-beige/30 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-tulinki-warm mb-4 flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Preferencje
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.newsletter}
                    onChange={(e) => handleInputChange('newsletter', e.target.checked)}
                    className="h-4 w-4 text-tulinki-rose focus:ring-tulinki-rose border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-tulinki-warm">
                    Chcę otrzymywać newsletter z ofertami i nowościami
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.smsMarketing}
                    onChange={(e) => handleInputChange('smsMarketing', e.target.checked)}
                    className="h-4 w-4 text-tulinki-rose focus:ring-tulinki-rose border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-tulinki-warm">
                    Chcę otrzymywać SMS-y z ofertami
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-tulinki-warm mb-2">
                    Preferowany język
                  </label>
                  <select
                    value={formData.preferredLanguage || 'pl'}
                    onChange={(e) => handleInputChange('preferredLanguage', e.target.value)}
                    className="w-full px-3 py-2 border border-tulinki-rose/30 rounded-lg focus:ring-2 focus:ring-tulinki-rose focus:border-transparent"
                  >
                    <option value="pl">Polski</option>
                    <option value="en">English</option>
                    <option value="de">Deutsch</option>
                    <option value="cs">Čeština</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-tulinki-warm mb-2">
                    Strefa czasowa
                  </label>
                  <select
                    value={formData.timezone || 'Europe/Warsaw'}
                    onChange={(e) => handleInputChange('timezone', e.target.value)}
                    className="w-full px-3 py-2 border border-tulinki-rose/30 rounded-lg focus:ring-2 focus:ring-tulinki-rose focus:border-transparent"
                  >
                    <option value="Europe/Warsaw">Europa/Warszawa</option>
                    <option value="Europe/Berlin">Europa/Berlin</option>
                    <option value="Europe/Prague">Europa/Praga</option>
                    <option value="Europe/Bratislava">Europa/Bratysława</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center px-6 py-3 bg-tulinki-burgundy text-white rounded-lg hover:bg-tulinki-wine disabled:opacity-50 transition-colors"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Zapisywanie...' : 'Zapisz zmiany'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
