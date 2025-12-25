'use client'

import { useState, useEffect } from 'react'
import { 
  Grid, 
  List, 
  Sliders, 
  SortAsc, 
  SortDesc,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  Star,
  ShoppingCart,
  Heart,
  Eye,
  Loader,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import ProductCard from './ProductCard'
import AdvancedSearchFilters, { SearchFilters } from './AdvancedSearchFilters'

export interface SearchResult {
  id: string
  type: 'product' | 'category' | 'brand'
  title: string
  description: string
  image?: string
  price?: number
  rating?: number
  category?: string
  url: string
  relevanceScore: number
  semanticMatch: string[]
  synonyms: string[]
}

interface SearchResultsProps {
  query: string
  results: SearchResult[]
  total: number
  loading?: boolean
  error?: string
  onFiltersChange?: (filters: SearchFilters) => void
  onSortChange?: (sortBy: string) => void
  onPageChange?: (page: number) => void
  currentPage?: number
  totalPages?: number
  sortBy?: string
  filters?: SearchFilters
  className?: string
}

export default function SearchResults({
  query,
  results,
  total,
  loading = false,
  error,
  onFiltersChange,
  onSortChange,
  onPageChange,
  currentPage = 1,
  totalPages = 1,
  sortBy = 'relevance',
  filters,
  className = ""
}: SearchResultsProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set())

  const sortOptions = [
    { value: 'relevance', label: 'Trafność', icon: SortAsc },
    { value: 'price-asc', label: 'Cena: od najniższej', icon: SortAsc },
    { value: 'price-desc', label: 'Cena: od najwyższej', icon: SortDesc },
    { value: 'rating', label: 'Ocena', icon: Star },
    { value: 'newest', label: 'Najnowsze', icon: SortDesc },
    { value: 'popular', label: 'Najpopularniejsze', icon: Star }
  ]

  const handleSortChange = (newSortBy: string) => {
    if (onSortChange) {
      onSortChange(newSortBy)
    }
  }

  const handlePageChange = (page: number) => {
    if (onPageChange && page >= 1 && page <= totalPages) {
      onPageChange(page)
    }
  }

  const handleFiltersChange = (newFilters: SearchFilters) => {
    if (onFiltersChange) {
      onFiltersChange(newFilters)
    }
  }

  const toggleProductSelection = (productId: string) => {
    const newSelected = new Set(selectedProducts)
    if (newSelected.has(productId)) {
      newSelected.delete(productId)
    } else {
      newSelected.add(productId)
    }
    setSelectedProducts(newSelected)
  }

  const getSortIcon = (option: any) => {
    const Icon = option.icon
    return <Icon className="h-4 w-4" />
  }

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    const start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    const end = Math.min(totalPages, start + maxVisible - 1)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-center py-12">
          <Loader className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-600">Szukam produktów...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Błąd wyszukiwania</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nie znaleziono produktów
          </h3>
          <p className="text-gray-600 mb-4">
            Nie znaleziono produktów dla zapytania "{query}"
          </p>
          <div className="text-sm text-gray-500">
            <p>Spróbuj:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Użyć innych słów kluczowych</li>
              <li>Sprawdzić pisownię</li>
              <li>Użyć bardziej ogólnych terminów</li>
              <li>Usunąć filtry</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Wyniki wyszukiwania
          </h2>
          <p className="text-gray-600">
            Znaleziono {total} produktów dla "{query}"
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* View Mode Toggle */}
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          {/* Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="h-4 w-4" />
            <span>Filtry</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="lg:w-80">
            <div className="sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Filtry</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden p-1 hover:bg-gray-100 rounded"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              {filters && (
                <AdvancedSearchFilters
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  onReset={() => handleFiltersChange({
                    categories: [],
                    priceRange: { min: 0, max: 10000 },
                    rating: 0,
                    availability: 'all',
                    brands: [],
                    colors: [],
                    sizes: [],
                    features: [],
                    sortBy: 'relevance',
                    freeShipping: false,
                    onSale: false,
                    inStock: false
                  })}
                />
              )}
            </div>
          </div>
        )}

        {/* Results */}
        <div className="flex-1">
          {/* Sort Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Sortuj według:</span>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-sm text-gray-600">
              Strona {currentPage} z {totalPages}
            </div>
          </div>

          {/* Results Grid/List */}
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {results.map((result) => (
              <div key={result.id} className="relative">
                {viewMode === 'list' ? (
                  <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                    <div className="flex space-x-4">
                      <div className="flex-shrink-0">
                        {result.image ? (
                          <img
                            src={result.image}
                            alt={result.title}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400 text-xs">Brak zdjęcia</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {result.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {result.description}
                        </p>
                        
                        <div className="flex items-center space-x-4 mt-2">
                          {result.price && (
                            <span className="text-lg font-semibold text-blue-600">
                              {result.price.toFixed(2)} zł
                            </span>
                          )}
                          
                          {result.rating && (
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-600">{result.rating}</span>
                            </div>
                          )}
                          
                          {result.category && (
                            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {result.category}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0 flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                          <Heart className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors">
                          <ShoppingCart className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <ProductCard
                    product={{
                      id: result.id,
                      name: result.title,
                      description: result.description,
                      price: result.price || 0,
                      image: result.image || '',
                      stock: 10, // Placeholder
                      category: { name: result.category || '' }
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 border rounded-lg transition-colors ${
                    page === currentPage
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}