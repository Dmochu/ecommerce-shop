import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [] })
    }

    const searchTerm = query.toLowerCase()

    // Wyszukaj produkty
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
          { tags: { has: searchTerm } }
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
      take: 5
    })

    // Wyszukaj kategorie
    const categories = await prisma.category.findMany({
      where: {
        name: { contains: searchTerm, mode: 'insensitive' },
        isActive: true
      },
      take: 3
    })

    // Wyszukaj marki (jeśli masz pole brand w produkcie)
    const brands = await prisma.product.findMany({
      where: {
        brand: { contains: searchTerm, mode: 'insensitive' },
        isActive: true
      },
      select: {
        brand: true
      },
      distinct: ['brand'],
      take: 3
    })

    // Stwórz sugestie
    const suggestions = []

    // Produkty
    products.forEach(product => {
      const avgRating = product.reviews.length > 0 
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
        : 0

      suggestions.push({
        id: `product-${product.id}`,
        type: 'product',
        title: product.name,
        subtitle: product.category.name,
        image: product.image,
        price: product.price,
        rating: Math.round(avgRating * 10) / 10,
        category: product.category.name,
        url: `/products/${product.id}`
      })
    })

    // Kategorie
    categories.forEach(category => {
      suggestions.push({
        id: `category-${category.id}`,
        type: 'category',
        title: category.name,
        subtitle: 'Kategoria',
        url: `/categories/${category.id}`
      })
    })

    // Marki
    brands.forEach(brand => {
      if (brand.brand) {
        suggestions.push({
          id: `brand-${brand.brand}`,
          type: 'brand',
          title: brand.brand,
          subtitle: 'Marka',
          url: `/brands/${brand.brand}`
        })
      }
    })

    // Dodaj sugestie na podstawie popularnych wyszukiwań
    const popularSuggestions = [
      'sukienki',
      'buty',
      'torebki',
      'biżuteria',
      'akcesoria',
      'kosmetyki',
      'perfumy'
    ]

    const matchingSuggestions = popularSuggestions
      .filter(suggestion => suggestion.includes(searchTerm))
      .slice(0, 2)
      .map(suggestion => ({
        id: `suggestion-${suggestion}`,
        type: 'suggestion',
        title: suggestion,
        subtitle: 'Popularne wyszukiwanie'
      }))

    suggestions.push(...matchingSuggestions)

    // Sortuj sugestie według trafności
    const sortedSuggestions = suggestions.sort((a, b) => {
      // Produkty na górze
      if (a.type === 'product' && b.type !== 'product') return -1
      if (b.type === 'product' && a.type !== 'product') return 1
      
      // Sortuj według długości tytułu (krótsze = bardziej trafne)
      return a.title.length - b.title.length
    })

    return NextResponse.json({
      suggestions: sortedSuggestions.slice(0, 8)
    })

  } catch (error) {
    console.error('Error fetching search suggestions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
