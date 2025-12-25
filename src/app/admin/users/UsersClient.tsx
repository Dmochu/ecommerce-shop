'use client'

import Link from 'next/link'
import { Users, Edit, Trash2, Shield, Phone, MapPin, Building, Mail, Calendar, Globe } from 'lucide-react'
import { useState } from 'react'

interface User {
  id: string
  name: string | null
  email: string
  firstName?: string | null
  lastName?: string | null
  phone?: string | null
  address?: string | null
  city?: string | null
  postalCode?: string | null
  country?: string | null
  isBusiness: boolean
  companyName?: string | null
  nip?: string | null
  newsletter: boolean
  smsMarketing: boolean
  preferredLanguage?: string | null
  lastLogin?: Date | null
  isActive: boolean
  emailVerified: boolean
  phoneVerified: boolean
  role: 'USER' | 'ADMIN'
  createdAt: Date
  _count: {
    orders: number
  }
}

const roleColors = {
  USER: 'bg-blue-100 text-blue-800',
  ADMIN: 'bg-red-100 text-red-800'
}

const roleLabels = {
  USER: 'Użytkownik',
  ADMIN: 'Administrator'
}

export default function UsersClient({ initialUsers }: { initialUsers: User[] }) {
  const [users, setUsers] = useState(initialUsers)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [deleteMessage, setDeleteMessage] = useState('')

  const handleDeleteUser = async (userId: string, userName: string, userEmail: string) => {
    const displayName = userName || userEmail
    if (!confirm(`Czy na pewno chcesz usunąć użytkownika "${displayName}"? Tej operacji nie można cofnąć.`)) {
      return
    }

    setIsDeleting(userId)
    setDeleteMessage('')

    try {
      // Symulacja usuwania z bazy danych
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Usuń użytkownika z listy lokalnej
      setUsers(prev => prev.filter(user => user.id !== userId))
      setDeleteMessage('Użytkownik został usunięty!')
      setTimeout(() => setDeleteMessage(''), 3000)
    } catch (error) {
      setDeleteMessage('Błąd podczas usuwania użytkownika!')
      setTimeout(() => setDeleteMessage(''), 3000)
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Zarządzanie Użytkownikami</h1>
          <p className="mt-2 text-gray-600">Przeglądaj i zarządzaj użytkownikami systemu</p>
        </div>
      </div>

      {/* Delete Message */}
      {deleteMessage && (
        <div className={`mb-4 p-4 rounded-lg ${
          deleteMessage.includes('Błąd') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {deleteMessage}
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Użytkownik
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kontakt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Adres
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Firma
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Zamówienia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data rejestracji
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Akcje
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  {/* Użytkownik */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : (user.name || 'Brak nazwy')}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {user.id.slice(-8)}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Kontakt */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center gap-1 mb-1">
                        <Mail className="h-3 w-3 text-gray-400" />
                        {user.email}
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Phone className="h-3 w-3 text-gray-400" />
                          {user.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  
                  {/* Adres */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user.address && (
                        <div className="flex items-center gap-1 mb-1">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          {user.address}
                        </div>
                      )}
                      {user.city && (
                        <div className="text-sm text-gray-500">
                          {user.city} {user.postalCode}
                        </div>
                      )}
                      {user.country && (
                        <div className="text-xs text-gray-400">
                          {user.country}
                        </div>
                      )}
                    </div>
                  </td>
                  
                  {/* Firma */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.isBusiness ? (
                      <div className="text-sm">
                        <div className="flex items-center gap-1 mb-1">
                          <Building className="h-3 w-3 text-gray-400" />
                          <span className="font-medium text-gray-900">{user.companyName}</span>
                        </div>
                        {user.nip && (
                          <div className="text-xs text-gray-500">
                            NIP: {user.nip}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Osoba prywatna</span>
                    )}
                  </td>
                  
                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
                        {roleLabels[user.role]}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? 'Aktywny' : 'Nieaktywny'}
                        </span>
                        {user.emailVerified && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Email ✓
                          </span>
                        )}
                        {user.phoneVerified && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Telefon ✓
                          </span>
                        )}
                      </div>
                      {user.newsletter && (
                        <div className="text-xs text-gray-500">
                          Newsletter: {user.newsletter ? 'Tak' : 'Nie'}
                        </div>
                      )}
                    </div>
                  </td>
                  
                  {/* Zamówienia */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user._count.orders} zamówień
                  </td>
                  
                  {/* Data rejestracji */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>
                      {new Date(user.createdAt).toLocaleDateString('pl-PL')}
                    </div>
                    {user.lastLogin && (
                      <div className="text-xs text-gray-400">
                        Ostatnie logowanie: {new Date(user.lastLogin).toLocaleDateString('pl-PL')}
                      </div>
                    )}
                  </td>
                  
                  {/* Akcje */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        href={`/admin/users/${user.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50 transition-colors"
                        title="Edytuj użytkownika"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteUser(user.id, user.name || '', user.email)}
                        disabled={isDeleting === user.id}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors disabled:opacity-50"
                        title="Usuń użytkownika"
                      >
                        {isDeleting === user.id ? (
                          <div className="h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Brak użytkowników</h3>
            <p className="mt-1 text-sm text-gray-500">Jeszcze nie ma żadnych użytkowników w systemie.</p>
          </div>
        )}
      </div>
    </div>
  )
}
