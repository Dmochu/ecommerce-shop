import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // W rzeczywistej aplikacji, trendujące wyszukiwania byłyby obliczane na podstawie
    // analizy logów wyszukiwań, popularności produktów, etc.
    // Na razie zwracamy statyczne dane

    const trendingSearches = [
      {
        id: 'trending-1',
        type: 'trending',
        title: 'sukienki letnie',
        subtitle: 'Trending',
        isTrending: true
      },
      {
        id: 'trending-2',
        type: 'trending',
        title: 'buty sportowe',
        subtitle: 'Popularne',
        isPopular: true
      },
      {
        id: 'trending-3',
        type: 'trending',
        title: 'torebki skórzane',
        subtitle: 'Trending',
        isTrending: true
      },
      {
        id: 'trending-4',
        type: 'trending',
        title: 'biżuteria srebrna',
        subtitle: 'Popularne',
        isPopular: true
      },
      {
        id: 'trending-5',
        type: 'trending',
        title: 'kosmetyki naturalne',
        subtitle: 'Trending',
        isTrending: true
      }
    ]

    return NextResponse.json({
      trending: trendingSearches
    })

  } catch (error) {
    console.error('Error fetching trending searches:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
