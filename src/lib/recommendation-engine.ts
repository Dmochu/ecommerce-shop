import { prisma } from '@/lib/prisma'

export interface RecommendationResult {
  productId: string
  score: number
  reason: string
  type: string
}

export interface UserContext {
  userId?: string
  sessionId?: string
  currentProductId?: string
  categoryId?: string
  priceRange?: { min: number; max: number }
}

export class RecommendationEngine {
  private static instance: RecommendationEngine

  public static getInstance(): RecommendationEngine {
    if (!RecommendationEngine.instance) {
      RecommendationEngine.instance = new RecommendationEngine()
    }
    return RecommendationEngine.instance
  }

  /**
   * Główna metoda do generowania rekomendacji
   */
  async getRecommendations(
    context: UserContext,
    limit: number = 10
  ): Promise<RecommendationResult[]> {
    const recommendations: RecommendationResult[] = []

    // 1. Podobne produkty (collaborative filtering)
    if (context.currentProductId) {
      const similarProducts = await this.getSimilarProducts(
        context.currentProductId,
        limit / 2
      )
      recommendations.push(...similarProducts)
    }

    // 2. Spersonalizowane rekomendacje (dla zalogowanych użytkowników)
    if (context.userId) {
      const personalizedRecs = await this.getPersonalizedRecommendations(
        context.userId,
        limit / 2
      )
      recommendations.push(...personalizedRecs)
    }

    // 3. Popularne produkty (trending)
    const trendingProducts = await this.getTrendingProducts(limit / 3)
    recommendations.push(...trendingProducts)

    // 4. Często kupowane razem
    if (context.currentProductId) {
      const frequentlyBought = await this.getFrequentlyBoughtTogether(
        context.currentProductId,
        limit / 3
      )
      recommendations.push(...frequentlyBought)
    }

    // 5. Filtruj duplikaty i sortuj według score
    const uniqueRecommendations = this.deduplicateAndSort(recommendations)
    
    return uniqueRecommendations.slice(0, limit)
  }

  /**
   * Podobne produkty na podstawie kategorii i cech
   */
  private async getSimilarProducts(
    productId: string,
    limit: number
  ): Promise<RecommendationResult[]> {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { category: true }
    })

    if (!product) return []

    // Znajdź produkty z tej samej kategorii
    const similarProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: productId },
        stock: { gt: 0 }
      },
      take: limit * 2,
      orderBy: { isRecommended: 'desc' }
    })

    return similarProducts.map(p => ({
      productId: p.id,
      score: this.calculateSimilarityScore(product, p),
      reason: `Podobny do ${product.name}`,
      type: 'SIMILAR_PRODUCTS'
    }))
  }

  /**
   * Spersonalizowane rekomendacje na podstawie historii użytkownika
   */
  private async getPersonalizedRecommendations(
    userId: string,
    limit: number
  ): Promise<RecommendationResult[]> {
    // Pobierz historię zachowań użytkownika
    const userBehaviors = await prisma.userBehavior.findMany({
      where: { userId },
      include: { product: { include: { category: true } } },
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    if (userBehaviors.length === 0) return []

    // Analizuj preferencje użytkownika
    const preferences = this.analyzeUserPreferences(userBehaviors)
    
    // Znajdź produkty pasujące do preferencji
    const recommendedProducts = await prisma.product.findMany({
      where: {
        categoryId: { in: preferences.categories },
        price: {
          gte: preferences.priceRange.min,
          lte: preferences.priceRange.max
        },
        stock: { gt: 0 }
      },
      take: limit * 2,
      orderBy: { isRecommended: 'desc' }
    })

    return recommendedProducts.map(p => ({
      productId: p.id,
      score: this.calculatePersonalizedScore(p, preferences),
      reason: 'Dopasowane do Twoich preferencji',
      type: 'PERSONALIZED'
    }))
  }

  /**
   * Popularne/trending produkty
   */
  public async getTrendingProducts(limit: number): Promise<RecommendationResult[]> {
    // Produkty z największą liczbą zakupów w ostatnim czasie
    const trendingProducts = await prisma.product.findMany({
      where: {
        stock: { gt: 0 },
        isRecommended: true
      },
      include: {
        orderItems: {
          where: {
            order: {
              createdAt: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Ostatnie 30 dni
              }
            }
          }
        }
      },
      take: limit * 2
    })

    return trendingProducts
      .map(p => ({
        productId: p.id,
        score: p.orderItems.length / 10, // Normalizacja
        reason: 'Popularne w ostatnim czasie',
        type: 'TRENDING'
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
  }

  /**
   * Często kupowane razem
   */
  private async getFrequentlyBoughtTogether(
    productId: string,
    limit: number
  ): Promise<RecommendationResult[]> {
    // Znajdź zamówienia zawierające ten produkt
    const ordersWithProduct = await prisma.orderItem.findMany({
      where: { productId },
      include: {
        order: {
          include: {
            items: {
              include: { product: true }
            }
          }
        }
      }
    })

    // Policz częstość występowania innych produktów
    const productFrequency = new Map<string, number>()
    
    ordersWithProduct.forEach(orderItem => {
      orderItem.order.items.forEach(item => {
        if (item.productId !== productId) {
          const count = productFrequency.get(item.productId) || 0
          productFrequency.set(item.productId, count + 1)
        }
      })
    })

    // Konwertuj na rekomendacje
    const recommendations: RecommendationResult[] = []
    productFrequency.forEach((frequency, productId) => {
      recommendations.push({
        productId,
        score: frequency / ordersWithProduct.length,
        reason: 'Często kupowane razem',
        type: 'FREQUENTLY_BOUGHT'
      })
    })

    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
  }

  /**
   * Analiza preferencji użytkownika
   */
  private analyzeUserPreferences(behaviors: any[]) {
    const categories = new Map<string, number>()
    const prices: number[] = []

    behaviors.forEach(behavior => {
      if (behavior.product.category) {
        const count = categories.get(behavior.product.categoryId) || 0
        categories.set(behavior.product.categoryId, count + 1)
      }
      prices.push(behavior.product.price)
    })

    // Najpopularniejsze kategorie
    const topCategories = Array.from(categories.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([categoryId]) => categoryId)

    // Zakres cenowy
    const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length
    const priceRange = {
      min: Math.max(0, avgPrice * 0.5),
      max: avgPrice * 1.5
    }

    return {
      categories: topCategories,
      priceRange
    }
  }

  /**
   * Obliczanie podobieństwa produktów
   */
  private calculateSimilarityScore(product1: any, product2: any): number {
    let score = 0

    // Ta sama kategoria = +0.5
    if (product1.categoryId === product2.categoryId) {
      score += 0.5
    }

    // Podobna cena = +0.3
    const priceDiff = Math.abs(product1.price - product2.price) / product1.price
    if (priceDiff < 0.2) {
      score += 0.3
    }

    // Podobna nazwa = +0.2
    const nameSimilarity = this.calculateStringSimilarity(product1.name, product2.name)
    score += nameSimilarity * 0.2

    return Math.min(score, 1)
  }

  /**
   * Obliczanie spersonalizowanego score
   */
  private calculatePersonalizedScore(product: any, preferences: any): number {
    let score = 0

    // Dopasowanie kategorii
    if (preferences.categories.includes(product.categoryId)) {
      score += 0.4
    }

    // Dopasowanie ceny
    if (product.price >= preferences.priceRange.min && 
        product.price <= preferences.priceRange.max) {
      score += 0.3
    }

    // Czy jest polecany
    if (product.isRecommended) {
      score += 0.2
    }

    // Czy jest popularny
    if (product.isPopular) {
      score += 0.1
    }

    return Math.min(score, 1)
  }

  /**
   * Obliczanie podobieństwa stringów (Jaro-Winkler)
   */
  private calculateStringSimilarity(str1: string, str2: string): number {
    const s1 = str1.toLowerCase()
    const s2 = str2.toLowerCase()
    
    if (s1 === s2) return 1
    if (s1.length === 0 || s2.length === 0) return 0

    const matchWindow = Math.floor(Math.max(s1.length, s2.length) / 2) - 1
    const s1Matches = new Array(s1.length).fill(false)
    const s2Matches = new Array(s2.length).fill(false)

    let matches = 0
    let transpositions = 0

    // Znajdź dopasowania
    for (let i = 0; i < s1.length; i++) {
      const start = Math.max(0, i - matchWindow)
      const end = Math.min(i + matchWindow + 1, s2.length)

      for (let j = start; j < end; j++) {
        if (s2Matches[j] || s1[i] !== s2[j]) continue
        s1Matches[i] = true
        s2Matches[j] = true
        matches++
        break
      }
    }

    if (matches === 0) return 0

    // Znajdź transpozycje
    let k = 0
    for (let i = 0; i < s1.length; i++) {
      if (!s1Matches[i]) continue
      while (!s2Matches[k]) k++
      if (s1[i] !== s2[k]) transpositions++
      k++
    }

    const jaro = (matches / s1.length + matches / s2.length + 
                 (matches - transpositions / 2) / matches) / 3

    // Winkler modification
    let prefix = 0
    for (let i = 0; i < Math.min(s1.length, s2.length, 4); i++) {
      if (s1[i] === s2[i]) prefix++
      else break
    }

    return jaro + (prefix * 0.1 * (1 - jaro))
  }

  /**
   * Usuwanie duplikatów i sortowanie
   */
  private deduplicateAndSort(recommendations: RecommendationResult[]): RecommendationResult[] {
    const seen = new Set<string>()
    const unique: RecommendationResult[] = []

    for (const rec of recommendations) {
      if (!seen.has(rec.productId)) {
        seen.add(rec.productId)
        unique.push(rec)
      }
    }

    return unique.sort((a, b) => b.score - a.score)
  }

  /**
   * Zapisanie zachowania użytkownika
   */
  async trackUserBehavior(
    userId: string | null,
    sessionId: string | null,
    productId: string,
    behaviorType: 'VIEW' | 'ADD_TO_CART' | 'PURCHASE' | 'WISHLIST' | 'SEARCH',
    metadata?: any
  ) {
    try {
      await prisma.userBehavior.create({
        data: {
          userId,
          sessionId,
          productId,
          behaviorType,
          metadata
        }
      })
    } catch (error) {
      console.error('Error tracking user behavior:', error)
    }
  }

  /**
   * Generowanie rekomendacji dla sesji gościa
   */
  async getGuestRecommendations(
    sessionId: string,
    limit: number = 10
  ): Promise<RecommendationResult[]> {
    // Pobierz zachowania z tej sesji
    const sessionBehaviors = await prisma.userBehavior.findMany({
      where: { sessionId },
      include: { product: { include: { category: true } } },
      orderBy: { createdAt: 'desc' },
      take: 20
    })

    if (sessionBehaviors.length === 0) {
      // Brak historii - zwróć popularne produkty
      return this.getTrendingProducts(limit)
    }

    // Analizuj zachowania sesji
    const preferences = this.analyzeUserPreferences(sessionBehaviors)
    
    // Znajdź produkty pasujące do preferencji
    const recommendedProducts = await prisma.product.findMany({
      where: {
        categoryId: { in: preferences.categories },
        price: {
          gte: preferences.priceRange.min,
          lte: preferences.priceRange.max
        },
        stock: { gt: 0 }
      },
      take: limit * 2,
      orderBy: { isRecommended: 'desc' }
    })

    return recommendedProducts.map(p => ({
      productId: p.id,
      score: this.calculatePersonalizedScore(p, preferences),
      reason: 'Dopasowane do Twojego przeglądania',
      type: 'PERSONALIZED'
    })).slice(0, limit)
  }
}

export const recommendationEngine = RecommendationEngine.getInstance()
