'use client'

import Link from 'next/link'
import { Plus, Edit, Trash2, Tag } from 'lucide-react'
import { useState } from 'react'

interface Category {
  id: string
  name: string
  image: string | null
  isPopular: boolean
  isFeatured: boolean
  description: string | null
  createdAt: Date
  updatedAt: Date
  _count: {
    products: number
  }
}

export default function CategoriesClient({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [deleteMessage, setDeleteMessage] = useState('')

  const handleDeleteCategory = async (categoryId: string, categoryName: string) => {
    if (!confirm(`Czy na pewno chcesz usunąć kategorię "${categoryName}"? Tej operacji nie można cofnąć.`)) {
      return
    }

    setIsDeleting(categoryId)
    setDeleteMessage('')

    try {
      // Symulacja usuwania z bazy danych
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Usuń kategorię z listy lokalnej
      setCategories(prev => prev.filter(category => category.id !== categoryId))
      setDeleteMessage('Kategoria została usunięta!')
      setTimeout(() => setDeleteMessage(''), 3000)
    } catch (error) {
      setDeleteMessage('Błąd podczas usuwania kategorii!')
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
          <h1 className="text-3xl font-bold text-gray-900">Zarządzanie Kategoriami</h1>
          <p className="mt-2 text-gray-600">Dodawaj, edytuj i usuwaj kategorie produktów</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Dodaj kategorię
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

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Tag className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="ml-3 text-lg font-semibold text-gray-900">{category.name}</h3>
              </div>
              <div className="flex items-center space-x-2">
                <Link
                  href={`/admin/categories/${category.id}/edit`}
                  className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50 transition-colors"
                  title="Edytuj"
                >
                  <Edit className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => handleDeleteCategory(category.id, category.name)}
                  disabled={isDeleting === category.id}
                  className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors disabled:opacity-50"
                  title="Usuń"
                >
                  {isDeleting === category.id ? (
                    <div className="h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              {category.image && (
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {/* Flagi kategorii */}
              <div className="flex flex-wrap gap-1">
                {category.isPopular && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    Popularna
                  </span>
                )}
                {category.isFeatured && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Wyróżniona
                  </span>
                )}
              </div>
              
              {/* Opis kategorii */}
              {category.description && (
                <p className="text-sm text-gray-600 line-clamp-2">{category.description}</p>
              )}
              
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Produktów: {category._count.products}</span>
                <span>Utworzono: {new Date(category.createdAt).toLocaleDateString('pl-PL')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <Tag className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Brak kategorii</h3>
          <p className="mt-1 text-sm text-gray-500">Zacznij od dodania pierwszej kategorii.</p>
          <div className="mt-6">
            <Link
              href="/admin/categories/new"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Dodaj kategorię
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
