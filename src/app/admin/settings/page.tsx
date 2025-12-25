'use client'

import { Settings, Database, Shield, Bell, Palette, Globe } from 'lucide-react'
import { useState } from 'react'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    general: {
      storeName: 'Sklep Online',
      contactEmail: 'kontakt@sklep.pl',
      phone: '+48 123 456 789',
      address: 'ul. Przykładowa 1, 00-000 Warszawa'
    },
    security: {
      minPasswordLength: 8,
      requireSpecialChars: true,
      sessionTimeout: '24 godziny'
    },
    notifications: {
      orderNotifications: true,
      lowStockNotifications: true,
      adminEmail: 'admin@sklep.pl'
    },
    appearance: {
      theme: 'Jasny',
      primaryColor: '#2563eb',
      logo: 'logo.png'
    },
    localization: {
      language: 'Polski',
      timezone: 'Europe/Warsaw',
      currency: 'PLN (zł)'
    }
  })

  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  const handleInputChange = (section: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }))
  }

  const handleSave = async (section: string) => {
    setIsSaving(true)
    setSaveMessage('')
    
    try {
      // Symulacja zapisu do bazy danych
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSaveMessage('Zmiany zostały zapisane!')
      setTimeout(() => setSaveMessage(''), 3000)
    } catch (error) {
      setSaveMessage('Błąd podczas zapisywania!')
      setTimeout(() => setSaveMessage(''), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  const settingsSections = [
    {
      title: 'Ogólne',
      description: 'Podstawowe ustawienia sklepu',
      icon: Settings,
      color: 'bg-blue-500',
      section: 'general',
      items: [
        { 
          name: 'Nazwa sklepu', 
          field: 'storeName',
          value: settings.general.storeName, 
          type: 'text' 
        },
        { 
          name: 'Email kontaktowy', 
          field: 'contactEmail',
          value: settings.general.contactEmail, 
          type: 'email' 
        },
        { 
          name: 'Telefon', 
          field: 'phone',
          value: settings.general.phone, 
          type: 'tel' 
        },
        { 
          name: 'Adres', 
          field: 'address',
          value: settings.general.address, 
          type: 'text' 
        }
      ]
    },
    {
      title: 'Baza danych',
      description: 'Ustawienia bazy danych i migracji',
      icon: Database,
      color: 'bg-green-500',
      section: 'database',
      items: [
        { name: 'Typ bazy danych', value: 'SQLite', type: 'text', readonly: true },
        { name: 'Status połączenia', value: 'Połączone', type: 'text', readonly: true },
        { name: 'Ostatnia migracja', value: '2024-01-15 10:30', type: 'text', readonly: true }
      ]
    },
    {
      title: 'Bezpieczeństwo',
      description: 'Ustawienia bezpieczeństwa i autoryzacji',
      icon: Shield,
      color: 'bg-red-500',
      section: 'security',
      items: [
        { 
          name: 'Minimalna długość hasła', 
          field: 'minPasswordLength',
          value: settings.security.minPasswordLength, 
          type: 'number' 
        },
        { 
          name: 'Wymagane znaki specjalne', 
          field: 'requireSpecialChars',
          value: settings.security.requireSpecialChars, 
          type: 'checkbox' 
        },
        { 
          name: 'Czas wygaśnięcia sesji', 
          field: 'sessionTimeout',
          value: settings.security.sessionTimeout, 
          type: 'select' 
        }
      ]
    },
    {
      title: 'Powiadomienia',
      description: 'Ustawienia powiadomień email',
      icon: Bell,
      color: 'bg-yellow-500',
      section: 'notifications',
      items: [
        { 
          name: 'Powiadomienia o zamówieniach', 
          field: 'orderNotifications',
          value: settings.notifications.orderNotifications, 
          type: 'toggle' 
        },
        { 
          name: 'Powiadomienia o niskim stanie', 
          field: 'lowStockNotifications',
          value: settings.notifications.lowStockNotifications, 
          type: 'toggle' 
        },
        { 
          name: 'Email administratora', 
          field: 'adminEmail',
          value: settings.notifications.adminEmail, 
          type: 'email' 
        }
      ]
    },
    {
      title: 'Wygląd',
      description: 'Ustawienia wyglądu i motywu',
      icon: Palette,
      color: 'bg-purple-500',
      section: 'appearance',
      items: [
        { 
          name: 'Motyw', 
          field: 'theme',
          value: settings.appearance.theme, 
          type: 'select' 
        },
        { 
          name: 'Kolor główny', 
          field: 'primaryColor',
          value: settings.appearance.primaryColor, 
          type: 'color' 
        },
        { 
          name: 'Logo', 
          field: 'logo',
          value: settings.appearance.logo, 
          type: 'file' 
        }
      ]
    },
    {
      title: 'Lokalizacja',
      description: 'Ustawienia języka i regionu',
      icon: Globe,
      color: 'bg-indigo-500',
      section: 'localization',
      items: [
        { 
          name: 'Język domyślny', 
          field: 'language',
          value: settings.localization.language, 
          type: 'select' 
        },
        { 
          name: 'Strefa czasowa', 
          field: 'timezone',
          value: settings.localization.timezone, 
          type: 'select' 
        },
        { 
          name: 'Waluta', 
          field: 'currency',
          value: settings.localization.currency, 
          type: 'select' 
        }
      ]
    }
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Ustawienia</h1>
        <p className="mt-2 text-gray-600">Zarządzaj ustawieniami systemu</p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-8">
        {settingsSections.map((section) => (
          <div key={section.title} className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${section.color} bg-opacity-10`}>
                  <section.icon className={`h-5 w-5 ${section.color.replace('bg-', 'text-')}`} />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                  <p className="text-sm text-gray-600">{section.description}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {section.items.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">{item.name}</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      {item.type === 'text' && (
                        <input
                          type="text"
                          value={String(item.value)}
                          readOnly={'readonly' in item ? item.readonly : false}
                          onChange={(e) => 'field' in item && item.field && handleInputChange(section.section, item.field, e.target.value)}
                          className={`px-3 py-2 border border-gray-300 rounded-md text-sm ${
                            ('readonly' in item ? item.readonly : false) ? 'bg-gray-50 text-gray-500' : 'bg-white text-gray-900'
                          }`}
                        />
                      )}
                      {item.type === 'email' && (
                        <input
                          type="email"
                          value={String(item.value)}
                          onChange={(e) => 'field' in item && item.field && handleInputChange(section.section, item.field, e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-900"
                        />
                      )}
                      {item.type === 'number' && (
                        <input
                          type="number"
                          value={String(item.value)}
                          onChange={(e) => 'field' in item && item.field && handleInputChange(section.section, item.field, parseInt(e.target.value))}
                          className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-900 w-20"
                        />
                      )}
                      {item.type === 'select' && (
                        <select 
                          value={String(item.value)}
                          onChange={(e) => 'field' in item && item.field && handleInputChange(section.section, item.field, e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-900"
                        >
                          {item.name === 'Motyw' && (
                            <>
                              <option value="Jasny">Jasny</option>
                              <option value="Ciemny">Ciemny</option>
                              <option value="Automatyczny">Automatyczny</option>
                            </>
                          )}
                          {item.name === 'Czas wygaśnięcia sesji' && (
                            <>
                              <option value="1 godzina">1 godzina</option>
                              <option value="24 godziny">24 godziny</option>
                              <option value="7 dni">7 dni</option>
                            </>
                          )}
                          {item.name === 'Język domyślny' && (
                            <>
                              <option value="Polski">Polski</option>
                              <option value="English">English</option>
                              <option value="Deutsch">Deutsch</option>
                            </>
                          )}
                          {item.name === 'Strefa czasowa' && (
                            <>
                              <option value="Europe/Warsaw">Europe/Warsaw</option>
                              <option value="Europe/London">Europe/London</option>
                              <option value="America/New_York">America/New_York</option>
                            </>
                          )}
                          {item.name === 'Waluta' && (
                            <>
                              <option value="PLN (zł)">PLN (zł)</option>
                              <option value="EUR (€)">EUR (€)</option>
                              <option value="USD ($)">USD ($)</option>
                            </>
                          )}
                        </select>
                      )}
                      {item.type === 'toggle' && (
                        <button 
                          onClick={() => 'field' in item && item.field && handleInputChange(section.section, item.field, !item.value)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            item.value ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            item.value ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      )}
                      {item.type === 'color' && (
                        <input
                          type="color"
                          value={String(item.value)}
                          onChange={(e) => 'field' in item && item.field && handleInputChange(section.section, item.field, e.target.value)}
                          className="h-10 w-16 border border-gray-300 rounded-md"
                        />
                      )}
                      {item.type === 'file' && (
                        <input
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file && 'field' in item && item.field) {
                              handleInputChange(section.section, item.field, file.name)
                            }
                          }}
                          className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-900"
                        />
                      )}
                      {item.type === 'checkbox' && (
                        <input
                          type="checkbox"
                          checked={Boolean(item.value)}
                          onChange={(e) => 'field' in item && item.field && handleInputChange(section.section, item.field, e.target.checked)}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
                <button 
                  onClick={() => handleSave(section.section)}
                  disabled={isSaving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm"
                >
                  {isSaving ? 'Zapisywanie...' : 'Zapisz zmiany'}
                </button>
                {saveMessage && (
                  <span className={`text-sm ${saveMessage.includes('Błąd') ? 'text-red-600' : 'text-green-600'}`}>
                    {saveMessage}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
