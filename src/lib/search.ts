import { prisma } from './prisma'

export interface SearchResult {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: {
    id: string
    name: string
  }
  relevance: number
}

export async function searchProducts(
  query: string, 
  categoryId?: string, 
  limit: number = 50,
  sortBy: string = 'relevance',
  sortOrder: 'asc' | 'desc' = 'desc'
): Promise<SearchResult[]> {
  if (!query.trim()) {
    return []
  }

  const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0)
  
  // Podstawowe wyszukiwanie
  const baseResults = await prisma.product.findMany({
    where: {
      ...(categoryId && { categoryId }),
      OR: [
        // Dokładne dopasowanie nazwy
        {
          name: {
            contains: query
          }
        },
        // Dokładne dopasowanie opisu
        {
          description: {
            contains: query
          }
        },
        // Wyszukiwanie po słowach kluczowych
        ...searchTerms.map(term => ({
          name: {
            contains: term
          }
        })),
        ...searchTerms.map(term => ({
          description: {
            contains: term
          }
        }))
      ]
    },
    include: {
      category: true
    },
    take: limit * 2 // Pobierz więcej, aby móc sortować po relevancy
  })

  // Oblicz relevancy dla każdego wyniku
  const resultsWithRelevance = baseResults.map(product => {
    let relevance = 0
    const productName = product.name.toLowerCase()
    const productDesc = product.description.toLowerCase()
    const queryLower = query.toLowerCase()

    // Dokładne dopasowanie nazwy (najwyższy priorytet)
    if (productName.includes(queryLower)) {
      relevance += 100
    }

    // Początek nazwy
    if (productName.startsWith(queryLower)) {
      relevance += 50
    }

    // Dokładne dopasowanie opisu
    if (productDesc.includes(queryLower)) {
      relevance += 30
    }

    // Wyszukiwanie po słowach kluczowych
    searchTerms.forEach(term => {
      if (productName.includes(term)) {
        relevance += 20
      }
      if (productDesc.includes(term)) {
        relevance += 10
      }
    })

    // Krótsze nazwy mają wyższy priorytet (dokładniejsze dopasowanie)
    relevance += Math.max(0, 20 - productName.length)

    return {
      ...product,
      relevance
    }
  })

  // Sortuj po relevancy i usuń duplikaty
  let uniqueResults = resultsWithRelevance
    .filter((product, index, self) => 
      index === self.findIndex(p => p.id === product.id)
    )

  // Zastosuj sortowanie
  if (sortBy === 'relevance') {
    uniqueResults.sort((a, b) => sortOrder === 'desc' ? b.relevance - a.relevance : a.relevance - b.relevance)
  } else if (sortBy === 'name') {
    uniqueResults.sort((a, b) => {
      const comparison = a.name.localeCompare(b.name)
      return sortOrder === 'desc' ? -comparison : comparison
    })
  } else if (sortBy === 'price') {
    uniqueResults.sort((a, b) => sortOrder === 'desc' ? b.price - a.price : a.price - b.price)
  } else if (sortBy === 'createdAt') {
    uniqueResults.sort((a, b) => {
      const comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      return sortOrder === 'desc' ? -comparison : comparison
    })
  }

  return uniqueResults.slice(0, limit)
}

export async function searchProductsWithFilters(
  query: string,
  filters: {
    categoryId?: string
    minPrice?: number
    maxPrice?: number
    inStock?: boolean
  } = {},
  limit: number = 50,
  sortBy: string = 'relevance',
  sortOrder: 'asc' | 'desc' = 'desc'
): Promise<SearchResult[]> {
  const baseResults = await searchProducts(query, filters.categoryId, limit * 2, sortBy, sortOrder)

  // Zastosuj filtry
  let filteredResults = baseResults

  if (filters.minPrice !== undefined) {
    filteredResults = filteredResults.filter(product => product.price >= filters.minPrice!)
  }

  if (filters.maxPrice !== undefined) {
    filteredResults = filteredResults.filter(product => product.price <= filters.maxPrice!)
  }

  if (filters.inStock) {
    // Pobierz produkty z aktualnym stanem magazynowym
    const inStockProductIds = await prisma.product.findMany({
      where: {
        stock: {
          gt: 0
        }
      },
      select: { id: true }
    })
    const inStockIds = new Set(inStockProductIds.map(p => p.id))
    filteredResults = filteredResults.filter(product => inStockIds.has(product.id))
  }

  return filteredResults.slice(0, limit)
}

// Funkcja do sugerowania produktów (autocomplete)
export async function suggestProducts(query: string, limit: number = 5): Promise<string[]> {
  if (!query.trim() || query.length < 2) {
    return []
  }

  const products = await prisma.product.findMany({
    where: {
      name: {
        contains: query
      }
    },
    select: {
      name: true
    },
    take: limit * 2,
    orderBy: {
      name: 'asc'
    }
  })

  // Usuń duplikaty i zwróć unikalne nazwy
  const uniqueNames = [...new Set(products.map(p => p.name))]
  return uniqueNames.slice(0, limit)
}
