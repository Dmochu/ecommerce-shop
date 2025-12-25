import { NextRequest, NextResponse } from 'next/server'
import { loyaltyEngine } from '@/lib/loyalty-engine'

export async function POST(request: NextRequest) {
  try {
    const { loyaltyUserId, pointsToSpend, orderId } = await request.json()

    if (!loyaltyUserId || !pointsToSpend) {
      return NextResponse.json(
        { error: 'Loyalty user ID and points to spend are required' },
        { status: 400 }
      )
    }

    const result = await loyaltyEngine.spendPoints(loyaltyUserId, pointsToSpend, orderId)

    return NextResponse.json(result)

  } catch (error) {
    console.error('Error spending loyalty points:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
