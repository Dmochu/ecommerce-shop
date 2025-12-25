'use client'

import { useState, useEffect } from 'react'
import { useSearch, useSearchHistory, useSearchFavorites } from '@/hooks/useSearch'
import SearchAutocomplete from '@/components/SearchAutocomplete'
import SearchResults from '@/components/SearchResults'
import { 
  Search, 
  Filter, 
  X, 
  History, 
  Star,
  TrendingUp,
  Clock,
  Zap
} from 'lucide-react'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  
  const {
    results,
    total,
    loading,
    error,
    currentPage,
    totalPages,
    sortBy,
    filters,
    search,
    updateFilters,
    updateSort,
    changePage,
    clearSearch
  } = useSearch()

  const { history, addToHistory, clearHistory } = useSearchHistory()
  const { favorites, addToFavorites, removeFromFavorites, isFavorite } = useSearchFavorites()

  // Pobierz query z URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const searchQuery = urlParams.get('q')
    if (searchQuery) {
      setQuery(searchQuery)
      search(searchQuery)
    }
  }, [])

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery)
    addToHistory(searchQuery)
    search(searchQuery)
    setShowSuggestions(false)
  }

  const handleSuggestionClick = (suggestion: any) => {
    if (suggestion.type === 'suggestion') {
      handleSearch(suggestion.title)
    } else {
      // Przekieruj do produktu/kategorii
      window.location.href = suggestion.url
    }
  }

  const handleQuickSearch = (quickQuery: string) => {
    setQuery(quickQuery)
    handleSearch(quickQuery)
  }

  const toggleFavorite = (searchQuery: string) => {
    if (isFavorite(searchQuery)) {
      removeFromFavorites(searchQuery)
    } else {
      addToFavorites(searchQuery)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Zaawansowane wyszukiwanie
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Znajdź dokładnie to, czego szukasz dzięki inteligentnemu wyszukiwaniu semantycznemu
            </p>
          </div>

          {/* Main Search Bar */}
          <div className="max-w-4xl mx-auto">
            <SearchAutocomplete
              onSearch={handleSearch}
              onSuggestionClick={handleSuggestionClick}
              placeholder="Szukaj produktów, kategorii, marek..."
              showVoiceSearch={true}
              showRecentSearches={true}
              showTrendingSearches={true}
              className="w-full"
            />
          </div>
        </div>

        {/* Quick Search Suggestions */}
        {!query && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Recent Searches */}
              {history.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <History className="h-5 w-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">Ostatnie wyszukiwania</h3>
                  </div>
                  <div className="space-y-2">
                    {history.slice(0, 5).map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickSearch(search)}
                        className="w-full text-left p-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between"
                      >
                        <span className="text-sm text-gray-700">{search}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(search)
                          }}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Star className={`h-4 w-4 ${
                            isFavorite(search) ? 'text-yellow-500 fill-current' : 'text-gray-400'
                          }`} />
                        </button>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={clearHistory}
                    className="text-xs text-gray-500 hover:text-gray-700 mt-2"
                  >
                    Wyczyść historię
                  </button>
                </div>
              )}

              {/* Favorites */}
              {favorites.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Star className="h-5 w-5 text-yellow-600" />
                    <h3 className="font-semibold text-gray-900">Ulubione</h3>
                  </div>
                  <div className="space-y-2">
                    {favorites.slice(0, 5).map((favorite, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickSearch(favorite)}
                        className="w-full text-left p-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between"
                      >
                        <span className="text-sm text-gray-700">{favorite}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeFromFavorites(favorite)
                          }}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <X className="h-4 w-4 text-gray-400" />
                        </button>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Categories */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Popularne kategorie</h3>
                </div>
                <div className="space-y-2">
                  {[
                    'Sukienki',
                    'Buty',
                    'Torebki',
                    'Kosmetyki',
                    'Biżuteria'
                  ].map((category, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickSearch(category)}
                      className="w-full text-left p-2 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search Results */}
        {query && (
          <SearchResults
            query={query}
            results={results}
            total={total}
            loading={loading}
            error={error}
            currentPage={currentPage}
            totalPages={totalPages}
            sortBy={sortBy}
            filters={filters}
            onFiltersChange={updateFilters}
            onSortChange={updateSort}
            onPageChange={changePage}
          />
        )}

        {/* No Results Help */}
        {query && results.length === 0 && !loading && (
          <div className="max-w-2xl mx-auto text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Nie znaleziono wyników dla "{query}"
            </h3>
            <div className="space-y-4">
              <p className="text-gray-600">
                Spróbuj użyć innych słów kluczowych lub sprawdź nasze sugestie:
              </p>
              
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  'sukienki letnie',
                  'buty sportowe',
                  'torebki skórzane',
                  'kosmetyki naturalne',
                  'biżuteria srebrna'
                ].map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickSearch(suggestion)}
                    className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
