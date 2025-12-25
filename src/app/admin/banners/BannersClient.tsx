'use client'

import Link from 'next/link'
import { Plus, Edit, Trash2, Image, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

interface Banner {
  id: string
  title: string
  subtitle: string | null
  image: string
  link: string | null
  active: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

export default function BannersClient({ initialBanners }: { initialBanners: Banner[] }) {
  const [banners, setBanners] = useState(initialBanners)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [deleteMessage, setDeleteMessage] = useState('')

  const handleDeleteBanner = async (bannerId: string, bannerTitle: string) => {
    if (!confirm(`Czy na pewno chcesz usunąć baner "${bannerTitle}"? Tej operacji nie można cofnąć.`)) {
      return
    }

    setIsDeleting(bannerId)
    setDeleteMessage('')

    try {
      // Symulacja usuwania z bazy danych
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Usuń baner z listy lokalnej
      setBanners(prev => prev.filter(banner => banner.id !== bannerId))
      setDeleteMessage('Baner został usunięty!')
      setTimeout(() => setDeleteMessage(''), 3000)
    } catch (error) {
      setDeleteMessage('Błąd podczas usuwania banera!')
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
          <h1 className="text-3xl font-bold text-gray-900">Zarządzanie Bannerami</h1>
          <p className="mt-2 text-gray-600">Dodawaj, edytuj i zarządzaj banerami na stronie głównej</p>
        </div>
        <Link
          href="/admin/banners/new"
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Dodaj baner
        </Link>
      </div>

      {/* Delete Message */}
      {deleteMessage && (
        <div className={`mb-4 p-4 rounded-lg ${
          deleteMessage.includes('Błąd') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {deleteMessage}
        </div>
      )}

      {/* Banners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <div key={banner.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
            {/* Banner Image */}
            <div className="aspect-video bg-gray-100 relative">
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  banner.active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {banner.active ? (
                    <>
                      <Eye className="h-3 w-3 mr-1" />
                      Aktywny
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-3 w-3 mr-1" />
                      Nieaktywny
                    </>
                  )}
                </span>
              </div>
              <div className="absolute bottom-2 left-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Kolejność: {banner.order}
                </span>
              </div>
            </div>

            {/* Banner Content */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{banner.title}</h3>
              {banner.subtitle && (
                <p className="text-sm text-gray-600 mb-3">{banner.subtitle}</p>
              )}
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {banner.link && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Ma link
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/admin/banners/${banner.id}/edit`}
                    className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50 transition-colors"
                    title="Edytuj"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDeleteBanner(banner.id, banner.title)}
                    disabled={isDeleting === banner.id}
                    className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors disabled:opacity-50"
                    title="Usuń"
                  >
                    {isDeleting === banner.id ? (
                      <div className="h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {banners.length === 0 && (
        <div className="text-center py-12">
          <Image className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Brak bannerów</h3>
          <p className="mt-1 text-sm text-gray-500">Zacznij od dodania pierwszego banera.</p>
          <div className="mt-6">
            <Link
              href="/admin/banners/new"
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Dodaj baner
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
