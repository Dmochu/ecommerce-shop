'use client'

import { useState, useEffect, useCallback } from 'react'
import { SearchFilters } from '@/components/AdvancedSearchFilters'

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

export interface SearchState {
  query: string
  results: SearchResult[]
  total: number
  loading: boolean
  error: string | null
  currentPage: number
  totalPages: number
  sortBy: string
  filters: SearchFilters
}

export function useSearch(initialQuery: string = '') {
  const [state, setState] = useState<SearchState>({
    query: initialQuery,
    results: [],
    total: 0,
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    sortBy: 'relevance',
    filters: {
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
    }
  })

  const search = useCallback(async (
    query: string,
    options: {
      page?: number
      sortBy?: string
      filters?: Partial<SearchFilters>
    } = {}
  ) => {
    if (!query.trim()) {
      setState(prev => ({ ...prev, results: [], total: 0, error: null }))
      return
    }

    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const { page = 1, sortBy = 'relevance', filters = {} } = options
      const mergedFilters = { ...state.filters, ...filters }

      const response = await fetch('/api/search/semantic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          filters: mergedFilters,
          sortBy,
          page,
          limit: 20
        })
      })

      if (!response.ok) {
        throw new Error('Failed to fetch search results')
      }

      const data = await response.json()

      setState(prev => ({
        ...prev,
        query,
        results: data.results || [],
        total: data.total || 0,
        currentPage: page,
        totalPages: Math.ceil((data.total || 0) / 20),
        sortBy,
        filters: mergedFilters,
        loading: false,
        error: null
      }))

    } catch (error) {
      console.error('Search error:', error)
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Search failed'
      }))
    }
  }, [state.filters])

  const updateFilters = useCallback((newFilters: SearchFilters) => {
    setState(prev => ({ ...prev, filters: newFilters }))
    if (state.query) {
      search(state.query, { filters: newFilters, page: 1 })
    }
  }, [state.query, search])

  const updateSort = useCallback((sortBy: string) => {
    setState(prev => ({ ...prev, sortBy }))
    if (state.query) {
      search(state.query, { sortBy, page: 1 })
    }
  }, [state.query, search])

  const changePage = useCallback((page: number) => {
    if (state.query) {
      search(state.query, { page })
    }
  }, [state.query, search])

  const clearSearch = useCallback(() => {
    setState(prev => ({
      ...prev,
      query: '',
      results: [],
      total: 0,
      currentPage: 1,
      totalPages: 1,
      error: null
    }))
  }, [])

  // Automatyczne wyszukiwanie przy zmianie query
  useEffect(() => {
    if (state.query && state.query.length >= 2) {
      const timeoutId = setTimeout(() => {
        search(state.query)
      }, 300) // Debounce 300ms

      return () => clearTimeout(timeoutId)
    }
  }, [state.query, search])

  return {
    ...state,
    search,
    updateFilters,
    updateSort,
    changePage,
    clearSearch
  }
}

// Hook do zarządzania historią wyszukiwań
export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('searchHistory')
    if (stored) {
      setHistory(JSON.parse(stored))
    }
  }, [])

  const addToHistory = useCallback((query: string) => {
    if (!query.trim()) return

    const newHistory = [query, ...history.filter(h => h !== query)].slice(0, 10)
    setHistory(newHistory)
    localStorage.setItem('searchHistory', JSON.stringify(newHistory))
  }, [history])

  const clearHistory = useCallback(() => {
    setHistory([])
    localStorage.removeItem('searchHistory')
  }, [])

  const removeFromHistory = useCallback((query: string) => {
    const newHistory = history.filter(h => h !== query)
    setHistory(newHistory)
    localStorage.setItem('searchHistory', JSON.stringify(newHistory))
  }, [history])

  return {
    history,
    addToHistory,
    clearHistory,
    removeFromHistory
  }
}

// Hook do zarządzania ulubionymi wyszukiwaniami
export function useSearchFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('searchFavorites')
    if (stored) {
      setFavorites(JSON.parse(stored))
    }
  }, [])

  const addToFavorites = useCallback((query: string) => {
    if (!query.trim() || favorites.includes(query)) return

    const newFavorites = [query, ...favorites].slice(0, 20)
    setFavorites(newFavorites)
    localStorage.setItem('searchFavorites', JSON.stringify(newFavorites))
  }, [favorites])

  const removeFromFavorites = useCallback((query: string) => {
    const newFavorites = favorites.filter(f => f !== query)
    setFavorites(newFavorites)
    localStorage.setItem('searchFavorites', JSON.stringify(newFavorites))
  }, [favorites])

  const isFavorite = useCallback((query: string) => {
    return favorites.includes(query)
  }, [favorites])

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite
  }
}

// Hook do analizy wyszukiwań
export function useSearchAnalytics() {
  const [analytics, setAnalytics] = useState({
    totalSearches: 0,
    popularQueries: [] as string[],
    searchTrends: [] as { date: string; count: number }[]
  })

  const trackSearch = useCallback((query: string) => {
    // W rzeczywistej aplikacji tutaj byłaby integracja z systemem analitycznym
    console.log('Tracking search:', query)
    
    setAnalytics(prev => ({
      ...prev,
      totalSearches: prev.totalSearches + 1
    }))
  }, [])

  const getSearchSuggestions = useCallback((query: string) => {
    // Zwróć sugestie na podstawie popularnych wyszukiwań
    const popularQueries = [
      'sukienki letnie',
      'buty sportowe',
      'torebki skórzane',
      'kosmetyki naturalne',
      'biżuteria srebrna'
    ]

    return popularQueries.filter(popular => 
      popular.toLowerCase().includes(query.toLowerCase())
    )
  }, [])

  return {
    analytics,
    trackSearch,
    getSearchSuggestions
  }
}
