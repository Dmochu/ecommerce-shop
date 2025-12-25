import { NextRequest, NextResponse } from 'next/server'
import { semanticSearchEngine } from '@/lib/semantic-search'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '20')
    const sortBy = searchParams.get('sortBy') as any || 'relevance'
    
    // Filtry
    const categories = searchParams.get('categories')?.split(',') || []
    const priceMin = parseFloat(searchParams.get('priceMin') || '0')
    const priceMax = parseFloat(searchParams.get('priceMax') || '10000')
    const rating = parseInt(searchParams.get('rating') || '0')
    const availability = searchParams.get('availability') as any || 'all'

    if (!query || query.length < 2) {
      return NextResponse.json({
        results: [],
        total: 0,
        query: '',
        suggestions: []
      })
    }

    const results = await semanticSearchEngine.searchProducts({
      query,
      limit,
      filters: {
        categories: categories.length > 0 ? categories : undefined,
        priceRange: { min: priceMin, max: priceMax },
        rating: rating > 0 ? rating : undefined,
        availability
      },
      sortBy
    })

    // Generuj sugestie na podstawie wyników
    const suggestions = results.slice(0, 5).map(result => ({
      id: result.id,
      title: result.title,
      type: result.type,
      url: result.url,
      relevanceScore: result.relevanceScore
    }))

    return NextResponse.json({
      results,
      total: results.length,
      query,
      suggestions,
      filters: {
        categories,
        priceRange: { min: priceMin, max: priceMax },
        rating,
        availability
      },
      sortBy
    })

  } catch (error) {
    console.error('Error in semantic search API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, filters, sortBy, limit } = body

    if (!query || query.length < 2) {
      return NextResponse.json({
        results: [],
        total: 0,
        query: '',
        suggestions: []
      })
    }

    const results = await semanticSearchEngine.searchProducts({
      query,
      limit: limit || 20,
      filters: filters || {},
      sortBy: sortBy || 'relevance'
    })

    return NextResponse.json({
      results,
      total: results.length,
      query,
      suggestions: results.slice(0, 5).map(result => ({
        id: result.id,
        title: result.title,
        type: result.type,
        url: result.url,
        relevanceScore: result.relevanceScore
      }))
    })

  } catch (error) {
    console.error('Error in semantic search API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
