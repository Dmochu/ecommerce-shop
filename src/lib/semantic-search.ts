import { prisma } from '@/lib/prisma'

export interface SemanticSearchResult {
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

export interface SemanticSearchOptions {
  query: string
  limit?: number
  filters?: {
    categories?: string[]
    priceRange?: { min: number; max: number }
    rating?: number
    availability?: 'all' | 'in-stock' | 'low-stock' | 'out-of-stock'
  }
  sortBy?: 'relevance' | 'price' | 'rating' | 'popularity'
}

export class SemanticSearchEngine {
  private static instance: SemanticSearchEngine

  public static getInstance(): SemanticSearchEngine {
    if (!SemanticSearchEngine.instance) {
      SemanticSearchEngine.instance = new SemanticSearchEngine()
    }
    return SemanticSearchEngine.instance
  }

  /**
   * Wyszukiwanie semantyczne produktów
   */
  async searchProducts(options: SemanticSearchOptions): Promise<SemanticSearchResult[]> {
    const { query, limit = 20, filters = {}, sortBy = 'relevance' } = options

    try {
      // Rozszerz zapytanie o synonimy i podobne terminy
      const expandedQuery = await this.expandQuery(query)
      
      // Wyszukaj produkty
      const products = await prisma.product.findMany({
        where: {
          AND: [
            {
              OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
                // Wyszukiwanie w synonimach
                ...expandedQuery.synonyms.map(synonym => ({
                  OR: [
                    { name: { contains: synonym, mode: 'insensitive' } },
                    { description: { contains: synonym, mode: 'insensitive' } }
                  ]
                }))
              ]
            },
            // Filtry
            filters.categories && filters.categories.length > 0 ? {
              categoryId: { in: filters.categories }
            } : {},
            filters.priceRange ? {
              price: {
                gte: filters.priceRange.min,
                lte: filters.priceRange.max
              }
            } : {},
            filters.rating ? {
              reviews: {
                some: {
                  rating: { gte: filters.rating }
                }
              }
            } : {},
            filters.availability === 'in-stock' ? {
              stock: { gt: 0 }
            } : filters.availability === 'low-stock' ? {
              stock: { gt: 0, lte: 5 }
            } : filters.availability === 'out-of-stock' ? {
              stock: 0
            } : {}
          ],
          isActive: true
        },
        include: {
          category: true,
          reviews: {
            select: {
              rating: true
            }
          }
        },
        take: limit * 2 // Pobierz więcej, aby móc sortować według trafności
      })

      // Oblicz wyniki z oceną trafności semantycznej
      const results = await this.calculateSemanticRelevance(products, query, expandedQuery)

      // Sortuj wyniki
      const sortedResults = this.sortResults(results, sortBy)

      return sortedResults.slice(0, limit)

    } catch (error) {
      console.error('Error in semantic search:', error)
      return []
    }
  }

  /**
   * Rozszerz zapytanie o synonimy i podobne terminy
   */
  private async expandQuery(query: string): Promise<{
    synonyms: string[]
    relatedTerms: string[]
    categories: string[]
  }> {
    const synonyms: string[] = []
    const relatedTerms: string[] = []
    const categories: string[] = []

    // Słownik synonimów (w rzeczywistej aplikacji byłby w bazie danych)
    const synonymDictionary: Record<string, string[]> = {
      'sukienka': ['dress', 'sukienki', 'sukieneczka', 'frock'],
      'buty': ['shoes', 'butki', 'obuwie', 'footwear'],
      'torebka': ['bag', 'torebki', 'handbag', 'purse'],
      'kosmetyki': ['cosmetics', 'makeup', 'beauty', 'pielęgnacja'],
      'biżuteria': ['jewelry', 'jewellery', 'ozdoby', 'accessories'],
      'perfumy': ['perfume', 'fragrance', 'zapach', 'eau de toilette'],
      'akcesoria': ['accessories', 'dodatki', 'akcesorium'],
      'letnie': ['summer', 'wiosenne', 'ciepłe'],
      'zimowe': ['winter', 'zimowe', 'ciepłe'],
      'eleganckie': ['elegant', 'formalne', 'wytworne'],
      'sportowe': ['sport', 'casual', 'relaksowe'],
      'skórzane': ['leather', 'skóra', 'naturalne'],
      'srebrne': ['silver', 'srebro', 'metalowe'],
      'złote': ['gold', 'złoto', 'luksusowe']
    }

    // Znajdź synonimy
    const queryWords = query.toLowerCase().split(' ')
    queryWords.forEach(word => {
      if (synonymDictionary[word]) {
        synonyms.push(...synonymDictionary[word])
      }
    })

    // Znajdź powiązane terminy na podstawie kategorii
    const categoryMappings: Record<string, string[]> = {
      'sukienki': ['odzież', 'moda', 'kobiece', 'eleganckie'],
      'buty': ['obuwie', 'moda', 'akcesoria'],
      'torebki': ['akcesoria', 'moda', 'kobiece'],
      'kosmetyki': ['pielęgnacja', 'uroda', 'beauty'],
      'biżuteria': ['akcesoria', 'ozdoby', 'luksusowe']
    }

    queryWords.forEach(word => {
      if (categoryMappings[word]) {
        relatedTerms.push(...categoryMappings[word])
      }
    })

    return { synonyms, relatedTerms, categories }
  }

  /**
   * Oblicz trafność semantyczną wyników
   */
  private async calculateSemanticRelevance(
    products: any[], 
    query: string, 
    expandedQuery: any
  ): Promise<SemanticSearchResult[]> {
    return products.map(product => {
      let relevanceScore = 0
      const semanticMatch: string[] = []
      const synonyms: string[] = []

      const queryLower = query.toLowerCase()
      const productName = product.name.toLowerCase()
      const productDescription = product.description?.toLowerCase() || ''

      // Sprawdź dokładne dopasowanie w nazwie
      if (productName.includes(queryLower)) {
        relevanceScore += 10
        semanticMatch.push('Nazwa produktu')
      }

      // Sprawdź dopasowanie w opisie
      if (productDescription.includes(queryLower)) {
        relevanceScore += 5
        semanticMatch.push('Opis produktu')
      }

      // Sprawdź dopasowanie w tagach
      if (product.tags && product.tags.includes(query)) {
        relevanceScore += 8
        semanticMatch.push('Tagi produktu')
      }

      // Sprawdź dopasowanie marki
      if (product.brand && product.brand.toLowerCase().includes(queryLower)) {
        relevanceScore += 6
        semanticMatch.push('Marka')
      }

      // Sprawdź synonimy
      expandedQuery.synonyms.forEach((synonym: string) => {
        if (productName.includes(synonym.toLowerCase()) || 
            productDescription.includes(synonym.toLowerCase())) {
          relevanceScore += 3
          synonyms.push(synonym)
        }
      })

      // Sprawdź kategorię
      if (product.category.name.toLowerCase().includes(queryLower)) {
        relevanceScore += 7
        semanticMatch.push('Kategoria')
      }

      // Bonus za ocenę
      const avgRating = product.reviews.length > 0 
        ? product.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / product.reviews.length
        : 0

      if (avgRating >= 4) {
        relevanceScore += 2
      }

      // Bonus za popularność (na podstawie liczby recenzji)
      if (product.reviews.length >= 10) {
        relevanceScore += 1
      }

      return {
        id: product.id,
        type: 'product' as const,
        title: product.name,
        description: product.description || '',
        image: product.image,
        price: product.price,
        rating: Math.round(avgRating * 10) / 10,
        category: product.category.name,
        url: `/products/${product.id}`,
        relevanceScore,
        semanticMatch,
        synonyms
      }
    })
  }

  /**
   * Sortuj wyniki według wybranego kryterium
   */
  private sortResults(results: SemanticSearchResult[], sortBy: string): SemanticSearchResult[] {
    switch (sortBy) {
      case 'price':
        return results.sort((a, b) => (a.price || 0) - (b.price || 0))
      case 'rating':
        return results.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      case 'popularity':
        return results.sort((a, b) => b.relevanceScore - a.relevanceScore)
      case 'relevance':
      default:
        return results.sort((a, b) => b.relevanceScore - a.relevanceScore)
    }
  }

  /**
   * Wyszukaj podobne produkty
   */
  async findSimilarProducts(productId: string, limit: number = 8): Promise<SemanticSearchResult[]> {
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
          category: true,
          reviews: {
            select: {
              rating: true
            }
          }
        }
      })

      if (!product) return []

      // Wyszukaj produkty z tej samej kategorii
      const similarProducts = await prisma.product.findMany({
        where: {
          categoryId: product.categoryId,
          id: { not: productId },
          isActive: true
        },
        include: {
          category: true,
          reviews: {
            select: {
              rating: true
            }
          }
        },
        take: limit
      })

      // Oblicz podobieństwo na podstawie ceny, oceny i kategorii
      return similarProducts.map(similar => {
        const avgRating = similar.reviews.length > 0 
          ? similar.reviews.reduce((sum, review) => sum + review.rating, 0) / similar.reviews.length
          : 0

        let similarityScore = 0

        // Podobieństwo ceny
        const priceDiff = Math.abs(product.price - similar.price) / product.price
        if (priceDiff < 0.2) similarityScore += 3
        else if (priceDiff < 0.5) similarityScore += 2
        else similarityScore += 1

        // Podobieństwo oceny
        const productRating = product.reviews.length > 0 
          ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
          : 0
        const ratingDiff = Math.abs(productRating - avgRating)
        if (ratingDiff < 0.5) similarityScore += 2
        else if (ratingDiff < 1) similarityScore += 1

        return {
          id: similar.id,
          type: 'product' as const,
          title: similar.name,
          description: similar.description || '',
          image: similar.image,
          price: similar.price,
          rating: Math.round(avgRating * 10) / 10,
          category: similar.category.name,
          url: `/products/${similar.id}`,
          relevanceScore: similarityScore,
          semanticMatch: ['Podobny produkt'],
          synonyms: []
        }
      }).sort((a, b) => b.relevanceScore - a.relevanceScore)

    } catch (error) {
      console.error('Error finding similar products:', error)
      return []
    }
  }

  /**
   * Wyszukaj produkty na podstawie obrazu (placeholder)
   */
  async searchByImage(imageUrl: string, limit: number = 10): Promise<SemanticSearchResult[]> {
    // W rzeczywistej aplikacji tutaj byłaby integracja z AI/ML do analizy obrazów
    // Na razie zwracamy pustą tablicę
    console.log('Image search not implemented yet:', imageUrl)
    return []
  }
}

export const semanticSearchEngine = SemanticSearchEngine.getInstance()
