'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface Category {
  id: string
  name: string
  image?: string | null
}

interface CategoryFilterProps {
  categories: Category[]
  selectedCategory?: string
}

export default function CategoryFilter({ categories, selectedCategory }: CategoryFilterProps) {
  const searchParams = useSearchParams()

  const createFilterUrl = (categoryId?: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (categoryId) {
      params.set('category', categoryId)
    } else {
      params.delete('category')
    }
    
    return `?${params.toString()}`
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Kategorie
      </h3>
      
      <div className="space-y-2">
        <Link
          href={createFilterUrl()}
          className={`block px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
            !selectedCategory
              ? 'bg-blue-100 text-blue-700 font-medium'
              : 'text-gray-700 hover:bg-gray-100 hover:scale-[1.02]'
          }`}
        >
          Wszystkie kategorie
        </Link>
        
        {categories.map((category) => (
          <Link
            key={category.id}
            href={createFilterUrl(category.id)}
            className={`block px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
              selectedCategory === category.id
                ? 'bg-blue-100 text-blue-700 font-medium'
                : 'text-gray-700 hover:bg-gray-100 hover:scale-[1.02]'
            }`}
          >
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  )
}
