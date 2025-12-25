'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { 
  Search, 
  X, 
  Clock, 
  TrendingUp, 
  Star, 
  Tag,
  Mic,
  MicOff,
  Loader,
  ArrowRight,
  History,
  Zap
} from 'lucide-react'

export interface SearchSuggestion {
  id: string
  type: 'product' | 'category' | 'brand' | 'suggestion' | 'recent' | 'trending'
  title: string
  subtitle?: string
  image?: string
  price?: number
  rating?: number
  category?: string
  url?: string
  isPopular?: boolean
  isTrending?: boolean
}

interface SearchAutocompleteProps {
  onSearch: (query: string, filters?: any) => void
  onSuggestionClick: (suggestion: SearchSuggestion) => void
  placeholder?: string
  className?: string
  showVoiceSearch?: boolean
  showRecentSearches?: boolean
  showTrendingSearches?: boolean
  maxSuggestions?: number
}

export default function SearchAutocomplete({
  onSearch,
  onSuggestionClick,
  placeholder = "Szukaj produktów...",
  className = "",
  showVoiceSearch = true,
  showRecentSearches = true,
  showTrendingSearches = true,
  maxSuggestions = 8
}: SearchAutocompleteProps) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isListening, setIsListening] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [trendingSearches, setTrendingSearches] = useState<SearchSuggestion[]>([])
  
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  // Inicjalizacja rozpoznawania mowy
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'pl-PL'

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setQuery(transcript)
        setIsListening(false)
        handleSearch(transcript)
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
      }
    }
  }, [])

  // Ładowanie ostatnich wyszukiwań
  useEffect(() => {
    const stored = localStorage.getItem('recentSearches')
    if (stored) {
      setRecentSearches(JSON.parse(stored))
    }
  }, [])

  // Ładowanie trendujących wyszukiwań
  useEffect(() => {
    fetchTrendingSearches()
  }, [])

  const fetchTrendingSearches = async () => {
    try {
      const response = await fetch('/api/search/trending')
      if (response.ok) {
        const data = await response.json()
        setTrendingSearches(data.trending || [])
      }
    } catch (error) {
      console.error('Error fetching trending searches:', error)
    }
  }

  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([])
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(searchQuery)}`)
      if (response.ok) {
        const data = await response.json()
        setSuggestions(data.suggestions || [])
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setSelectedIndex(-1)
    
    if (value.length >= 2) {
      fetchSuggestions(value)
      setIsOpen(true)
    } else {
      setSuggestions([])
      setIsOpen(value.length > 0)
    }
  }

  const handleSearch = (searchQuery: string = query) => {
    if (searchQuery.trim()) {
      // Dodaj do ostatnich wyszukiwań
      const newRecent = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5)
      setRecentSearches(newRecent)
      localStorage.setItem('recentSearches', JSON.stringify(newRecent))
      
      onSearch(searchQuery)
      setIsOpen(false)
      setQuery('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => Math.min(prev + 1, getVisibleSuggestions().length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => Math.max(prev - 1, -1))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0) {
          const visibleSuggestions = getVisibleSuggestions()
          const suggestion = visibleSuggestions[selectedIndex]
          if (suggestion) {
            handleSuggestionClick(suggestion)
          }
        } else {
          handleSearch()
        }
        break
      case 'Escape':
        setIsOpen(false)
        setSelectedIndex(-1)
        break
    }
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'suggestion') {
      setQuery(suggestion.title)
      handleSearch(suggestion.title)
    } else {
      onSuggestionClick(suggestion)
    }
    setIsOpen(false)
  }

  const handleVoiceSearch = () => {
    if (!recognitionRef.current) return

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const getVisibleSuggestions = () => {
    const allSuggestions = [
      ...suggestions.slice(0, maxSuggestions),
      ...(query.length < 2 && showRecentSearches ? recentSearches.map(search => ({
        id: `recent-${search}`,
        type: 'recent' as const,
        title: search,
        subtitle: 'Ostatnie wyszukiwanie'
      })) : []),
      ...(query.length < 2 && showTrendingSearches ? trendingSearches.slice(0, 3) : [])
    ]
    return allSuggestions
  }

  const getSuggestionIcon = (suggestion: SearchSuggestion) => {
    switch (suggestion.type) {
      case 'product':
        return <Search className="h-4 w-4 text-blue-600" />
      case 'category':
        return <Tag className="h-4 w-4 text-green-600" />
      case 'brand':
        return <Star className="h-4 w-4 text-purple-600" />
      case 'recent':
        return <History className="h-4 w-4 text-gray-500" />
      case 'trending':
        return <TrendingUp className="h-4 w-4 text-orange-600" />
      default:
        return <Search className="h-4 w-4 text-gray-500" />
    }
  }

  const getSuggestionBadge = (suggestion: SearchSuggestion) => {
    if (suggestion.isTrending) {
      return <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">Trending</span>
    }
    if (suggestion.isPopular) {
      return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Popularne</span>
    }
    return null
  }

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-20 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-3">
          {showVoiceSearch && (
            <button
              onClick={handleVoiceSearch}
              className={`p-2 rounded-lg transition-colors ${
                isListening 
                  ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
              title={isListening ? 'Zatrzymaj nagrywanie' : 'Wyszukiwanie głosowe'}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
          )}
          
          {query && (
            <button
              onClick={() => {
                setQuery('')
                setSuggestions([])
                setIsOpen(false)
                inputRef.current?.focus()
              }}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && (
        <div 
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto"
        >
          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <Loader className="h-5 w-5 animate-spin text-blue-600" />
              <span className="ml-2 text-sm text-gray-600">Szukam sugestii...</span>
            </div>
          )}

          {!isLoading && getVisibleSuggestions().length === 0 && query.length >= 2 && (
            <div className="py-4 px-4 text-center text-gray-500">
              <Search className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>Nie znaleziono sugestii dla "{query}"</p>
            </div>
          )}

          {!isLoading && getVisibleSuggestions().length > 0 && (
            <div className="py-2">
              {getVisibleSuggestions().map((suggestion, index) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                    index === selectedIndex ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex-shrink-0">
                    {getSuggestionIcon(suggestion)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {suggestion.title}
                      </p>
                      {getSuggestionBadge(suggestion)}
                    </div>
                    
                    {suggestion.subtitle && (
                      <p className="text-xs text-gray-500 truncate">
                        {suggestion.subtitle}
                      </p>
                    )}
                    
                    {'price' in suggestion && suggestion.price && (
                      <p className="text-sm font-semibold text-blue-600">
                        {suggestion.price.toFixed(2)} zł
                      </p>
                    )}
                    
                    {'rating' in suggestion && suggestion.rating && (
                      <div className="flex items-center space-x-1 mt-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-600">{suggestion.rating}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-shrink-0">
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          {query.length >= 2 && (
            <div className="border-t border-gray-200 p-3">
              <button
                onClick={() => handleSearch()}
                className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Search className="h-4 w-4" />
                <span>Szukaj "{query}"</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}