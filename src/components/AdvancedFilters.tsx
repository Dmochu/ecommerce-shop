'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react'

interface AdvancedFiltersProps {
  categories: Array<{
    id: string
    name: string
  }>
  totalResults: number
}

export default function AdvancedFilters({ categories, totalResults }: AdvancedFiltersProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isExpanded, setIsExpanded] = useState(false)

  const currentSearch = searchParams.get('search') || ''
  const currentCategory = searchParams.get('category') || ''
  const currentMinPrice = searchParams.get('minPrice') || ''
  const currentMaxPrice = searchParams.get('maxPrice') || ''
  const currentInStock = searchParams.get('inStock') === 'true'

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })

    router.push(`/products?${params.toString()}`)
  }

  const clearAllFilters = () => {
    const params = new URLSearchParams()
    if (currentSearch) {
      params.set('search', currentSearch)
    }
    router.push(`/products?${params.toString()}`)
  }

  const hasActiveFilters = currentCategory || currentMinPrice || currentMaxPrice || currentInStock

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <h3 className="font-medium text-gray-900">Filtry</h3>
            {hasActiveFilters && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Aktywne
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {totalResults} wyników
            </span>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </button>
          </div>
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
          >
            <X className="h-3 w-3" />
            <span>Wyczyść wszystkie filtry</span>
          </button>
        )}
      </div>

      {/* Filters Content */}
      {isExpanded && (
        <div className="p-4 space-y-6">
          {/* Kategoria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategoria
            </label>
            <select
              value={currentCategory}
              onChange={(e) => updateFilters({ category: e.target.value || null })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Wszystkie kategorie</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Zakres cen */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zakres cen (zł)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Od"
                value={currentMinPrice}
                onChange={(e) => updateFilters({ minPrice: e.target.value || null })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                step="0.01"
              />
              <input
                type="number"
                placeholder="Do"
                value={currentMaxPrice}
                onChange={(e) => updateFilters({ maxPrice: e.target.value || null })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Dostępność */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={currentInStock}
                onChange={(e) => updateFilters({ inStock: e.target.checked ? 'true' : null })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                Tylko produkty w magazynie
              </span>
            </label>
          </div>

          {/* Aktywne filtry */}
          {hasActiveFilters && (
            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Aktywne filtry:</h4>
              <div className="flex flex-wrap gap-2">
                {currentCategory && (
                  <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Kategoria: {categories.find(c => c.id === currentCategory)?.name}
                    <button
                      onClick={() => updateFilters({ category: null })}
                      className="ml-1 hover:text-blue-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {currentMinPrice && (
                  <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Od: {currentMinPrice} zł
                    <button
                      onClick={() => updateFilters({ minPrice: null })}
                      className="ml-1 hover:text-blue-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {currentMaxPrice && (
                  <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Do: {currentMaxPrice} zł
                    <button
                      onClick={() => updateFilters({ maxPrice: null })}
                      className="ml-1 hover:text-blue-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {currentInStock && (
                  <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    W magazynie
                    <button
                      onClick={() => updateFilters({ inStock: null })}
                      className="ml-1 hover:text-blue-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
