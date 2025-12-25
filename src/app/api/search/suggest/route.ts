import { NextRequest, NextResponse } from 'next/server'
import { suggestProducts } from '@/lib/search'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [] })
    }

    const suggestions = await suggestProducts(query, 5)

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error('Search suggestion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
