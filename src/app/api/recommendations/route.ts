import { NextRequest, NextResponse } from 'next/server'
import { recommendationEngine } from '@/lib/recommendation-engine'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const sessionId = searchParams.get('sessionId')
    const productId = searchParams.get('productId')
    const categoryId = searchParams.get('categoryId')
    const limit = parseInt(searchParams.get('limit') || '10')

    const context = {
      userId: userId || undefined,
      sessionId: sessionId || undefined,
      currentProductId: productId || undefined,
      categoryId: categoryId || undefined
    }

    let recommendations

    if (userId) {
      // Zalogowany użytkownik
      recommendations = await recommendationEngine.getRecommendations(context, limit)
    } else if (sessionId) {
      // Gość z sesją
      recommendations = await recommendationEngine.getGuestRecommendations(sessionId, limit)
    } else {
      // Brak kontekstu - zwróć popularne produkty
      recommendations = await recommendationEngine.getTrendingProducts(limit)
    }

    return NextResponse.json({
      recommendations
    })

  } catch (error) {
    console.error('Error fetching recommendations:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, sessionId, productId, behaviorType, metadata } = await request.json()

    if (!productId || !behaviorType) {
      return NextResponse.json(
        { error: 'productId and behaviorType are required' },
        { status: 400 }
      )
    }

    await recommendationEngine.trackUserBehavior(
      userId || null,
      sessionId || null,
      productId,
      behaviorType,
      metadata
    )

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error tracking user behavior:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
