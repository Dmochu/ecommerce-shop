'use client'

import { useState, useEffect } from 'react'
import { 
  Filter, 
  X, 
  ChevronDown, 
  ChevronUp,
  Sliders,
  Star,
  Truck,
  Tag,
  Palette,
  Ruler,
  DollarSign,
  CheckCircle,
  RotateCcw
} from 'lucide-react'

export interface SearchFilters {
  categories: string[]
  priceRange: { min: number; max: number }
  rating: number
  availability: 'all' | 'in-stock' | 'low-stock' | 'out-of-stock'
  brands: string[]
  colors: string[]
  sizes: string[]
  features: string[]
  sortBy: 'relevance' | 'price-asc' | 'price-desc' | 'rating' | 'newest' | 'popular'
  freeShipping: boolean
  onSale: boolean
  inStock: boolean
}

interface AdvancedSearchFiltersProps {
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
  onReset: () => void
  categories?: Array<{ id: string; name: string }>
  brands?: Array<{ id: string; name: string }>
  colors?: Array<{ id: string; name: string; hex: string }>
  sizes?: Array<{ id: string; name: string }>
  features?: Array<{ id: string; name: string }>
  className?: string
}

export default function AdvancedSearchFilters({
  filters,
  onFiltersChange,
  onReset,
  categories = [],
  brands = [],
  colors = [],
  sizes = [],
  features = [],
  className = ""
}: AdvancedSearchFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['price', 'availability']))
  const [priceInput, setPriceInput] = useState({
    min: filters.priceRange.min.toString(),
    max: filters.priceRange.max.toString()
  })

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = parseFloat(value) || 0
    setPriceInput({ ...priceInput, [type]: value })
    
    if (type === 'min') {
      updateFilter('priceRange', { ...filters.priceRange, min: numValue })
    } else {
      updateFilter('priceRange', { ...filters.priceRange, max: numValue })
    }
  }

  const toggleArrayFilter = (key: 'categories' | 'brands' | 'colors' | 'sizes' | 'features', value: string) => {
    const currentArray = filters[key] as string[]
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value]
    updateFilter(key, newArray)
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.categories.length > 0) count++
    if (filters.brands.length > 0) count++
    if (filters.colors.length > 0) count++
    if (filters.sizes.length > 0) count++
    if (filters.features.length > 0) count++
    if (filters.priceRange.min > 0 || filters.priceRange.max < 10000) count++
    if (filters.rating > 0) count++
    if (filters.availability !== 'all') count++
    if (filters.freeShipping) count++
    if (filters.onSale) count++
    if (filters.inStock) count++
    return count
  }

  const FilterSection = ({ 
    title, 
    sectionKey, 
    children, 
    icon: Icon = Filter 
  }: { 
    title: string; 
    sectionKey: string; 
    children: React.ReactNode; 
    icon?: any;
  }) => {
    const isExpanded = expandedSections.has(sectionKey)
    
    return (
      <div className="border-b border-gray-200 last:border-b-0">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full flex items-center justify-between py-4 text-left hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <Icon className="h-5 w-5 text-gray-600" />
            <span className="font-medium text-gray-900">{title}</span>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </button>
        
        {isExpanded && (
          <div className="pb-4">
            {children}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sliders className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Filtry</h3>
            {getActiveFiltersCount() > 0 && (
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                {getActiveFiltersCount()}
              </span>
            )}
          </div>
          <button
            onClick={onReset}
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center space-x-1"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Wyczyść</span>
          </button>
        </div>
      </div>

      <div className="p-4 space-y-1">
        {/* Price Range */}
        <FilterSection title="Cena" sectionKey="price" icon={DollarSign}>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Od</label>
                <input
                  type="number"
                  value={priceInput.min}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Do</label>
                <input
                  type="number"
                  value={priceInput.max}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1000"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="0"
                max="1000"
                value={filters.priceRange.max}
                onChange={(e) => {
                  const value = parseInt(e.target.value)
                  updateFilter('priceRange', { ...filters.priceRange, max: value })
                  setPriceInput({ ...priceInput, max: value.toString() })
                }}
                className="flex-1"
              />
              <span className="text-sm text-gray-600">{filters.priceRange.max} zł</span>
            </div>
          </div>
        </FilterSection>

        {/* Availability */}
        <FilterSection title="Dostępność" sectionKey="availability" icon={Truck}>
          <div className="space-y-2">
            {[
              { value: 'all', label: 'Wszystkie produkty' },
              { value: 'in-stock', label: 'Dostępne' },
              { value: 'low-stock', label: 'Ostatnie sztuki' },
              { value: 'out-of-stock', label: 'Niedostępne' }
            ].map((option) => (
              <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="availability"
                  value={option.value}
                  checked={filters.availability === option.value}
                  onChange={(e) => updateFilter('availability', e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Categories */}
        {categories.length > 0 && (
          <FilterSection title="Kategorie" sectionKey="categories" icon={Tag}>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {categories.map((category) => (
                <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category.id)}
                    onChange={() => toggleArrayFilter('categories', category.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <span className="text-sm text-gray-700">{category.name}</span>
                </label>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Brands */}
        {brands.length > 0 && (
          <FilterSection title="Marki" sectionKey="brands" icon={Tag}>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {brands.map((brand) => (
                <label key={brand.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.brands.includes(brand.id)}
                    onChange={() => toggleArrayFilter('brands', brand.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <span className="text-sm text-gray-700">{brand.name}</span>
                </label>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Colors */}
        {colors.length > 0 && (
          <FilterSection title="Kolory" sectionKey="colors" icon={Palette}>
            <div className="grid grid-cols-2 gap-2">
              {colors.map((color) => (
                <label key={color.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.colors.includes(color.id)}
                    onChange={() => toggleArrayFilter('colors', color.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: color.hex }}
                    ></div>
                    <span className="text-sm text-gray-700">{color.name}</span>
                  </div>
                </label>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Sizes */}
        {sizes.length > 0 && (
          <FilterSection title="Rozmiary" sectionKey="sizes" icon={Ruler}>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <label key={size.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.sizes.includes(size.id)}
                    onChange={() => toggleArrayFilter('sizes', size.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <span className="text-sm text-gray-700">{size.name}</span>
                </label>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Rating */}
        <FilterSection title="Ocena" sectionKey="rating" icon={Star}>
          <div className="space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <label key={rating} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  value={rating}
                  checked={filters.rating === rating}
                  onChange={(e) => updateFilter('rating', parseInt(e.target.value))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-700 ml-1">i więcej</span>
                </div>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Features */}
        {features.length > 0 && (
          <FilterSection title="Cechy" sectionKey="features" icon={CheckCircle}>
            <div className="space-y-2">
              {features.map((feature) => (
                <label key={feature.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.features.includes(feature.id)}
                    onChange={() => toggleArrayFilter('features', feature.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <span className="text-sm text-gray-700">{feature.name}</span>
                </label>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Quick Filters */}
        <FilterSection title="Szybkie filtry" sectionKey="quick" icon={Sliders}>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.freeShipping}
                onChange={(e) => updateFilter('freeShipping', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
              />
              <span className="text-sm text-gray-700">Darmowa dostawa</span>
            </label>
            
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.onSale}
                onChange={(e) => updateFilter('onSale', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
              />
              <span className="text-sm text-gray-700">W promocji</span>
            </label>
            
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => updateFilter('inStock', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
              />
              <span className="text-sm text-gray-700">Dostępne</span>
            </label>
          </div>
        </FilterSection>

        {/* Sort By */}
        <FilterSection title="Sortowanie" sectionKey="sort" icon={Sliders}>
          <div className="space-y-2">
            {[
              { value: 'relevance', label: 'Trafność' },
              { value: 'price-asc', label: 'Cena: od najniższej' },
              { value: 'price-desc', label: 'Cena: od najwyższej' },
              { value: 'rating', label: 'Ocena' },
              { value: 'newest', label: 'Najnowsze' },
              { value: 'popular', label: 'Najpopularniejsze' }
            ].map((option) => (
              <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="sortBy"
                  value={option.value}
                  checked={filters.sortBy === option.value}
                  onChange={(e) => updateFilter('sortBy', e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </FilterSection>
      </div>
    </div>
  )
}
