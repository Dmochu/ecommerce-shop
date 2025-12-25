'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, Eye, EyeOff, Settings, Copy } from 'lucide-react'
import Link from 'next/link'

interface Page {
  id: string
  title: string
  slug: string
  description: string | null
  active: boolean
  createdAt: Date
  updatedAt: Date
  modules: Array<{
    id: string
    type: string
    title: string | null
    active: boolean
  }>
  _count: {
    modules: number
  }
}

interface PagesClientProps {
  initialPages: Page[]
}

export default function PagesClient({ initialPages }: PagesClientProps) {
  const [pages, setPages] = useState(initialPages)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all')

  const filteredPages = pages.filter(page => {
    const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         page.slug.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (filterActive === 'active') return matchesSearch && page.active
    if (filterActive === 'inactive') return matchesSearch && !page.active
    return matchesSearch
  })

  const togglePageActive = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/pages/${id}/toggle`, {
        method: 'PATCH'
      })
      
      if (response.ok) {
        setPages(pages.map(page => 
          page.id === id ? { ...page, active: !page.active } : page
        ))
      }
    } catch (error) {
      console.error('Error toggling page:', error)
    }
  }

  const deletePage = async (id: string) => {
    if (!confirm('Czy na pewno chcesz usunąć tę stronę?')) return

    try {
      const response = await fetch(`/api/admin/pages/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setPages(pages.filter(page => page.id !== id))
      }
    } catch (error) {
      console.error('Error deleting page:', error)
    }
  }

  const duplicatePage = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/pages/${id}/duplicate`, {
        method: 'POST'
      })
      
      if (response.ok) {
        const newPage = await response.json()
        setPages([newPage, ...pages])
      }
    } catch (error) {
      console.error('Error duplicating page:', error)
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Zarządzanie stronami</h1>
          <p className="text-gray-600">Twórz i edytuj strony za pomocą edytora wizualnego</p>
        </div>
        <Link
          href="/admin/pages/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nowa strona
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Szukaj stron..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilterActive('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterActive === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Wszystkie
            </button>
            <button
              onClick={() => setFilterActive('active')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterActive === 'active' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Aktywne
            </button>
            <button
              onClick={() => setFilterActive('inactive')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterActive === 'inactive' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Nieaktywne
            </button>
          </div>
        </div>
      </div>

      {/* Pages List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {filteredPages.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Settings className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Brak stron</h3>
            <p className="text-gray-500 mb-4">Utwórz pierwszą stronę, aby rozpocząć</p>
            <Link
              href="/admin/pages/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nowa strona
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredPages.map((page) => (
              <div key={page.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{page.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        page.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {page.active ? 'Aktywna' : 'Nieaktywna'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                      <span>Slug: /{page.slug}</span>
                      <span>•</span>
                      <span>{page._count.modules} modułów</span>
                      <span>•</span>
                      <span>Utworzona: {new Date(page.createdAt).toLocaleDateString('pl-PL')}</span>
                    </div>
                    
                    {page.description && (
                      <p className="text-gray-600 text-sm">{page.description}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => togglePageActive(page.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        page.active 
                          ? 'text-green-600 hover:bg-green-50' 
                          : 'text-gray-400 hover:bg-gray-50'
                      }`}
                      title={page.active ? 'Dezaktywuj' : 'Aktywuj'}
                    >
                      {page.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    
                    <Link
                      href={`/admin/pages/${page.id}/edit`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edytuj"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    
                    <button
                      onClick={() => duplicatePage(page.id)}
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      title="Duplikuj"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => deletePage(page.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Usuń"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {/* Modules Preview */}
                {page.modules.length > 0 && (
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {page.modules.slice(0, 5).map((module) => (
                        <span
                          key={module.id}
                          className={`px-2 py-1 text-xs rounded-full ${
                            module.active 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {module.title || module.type}
                        </span>
                      ))}
                      {page.modules.length > 5 && (
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                          +{page.modules.length - 5} więcej
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
