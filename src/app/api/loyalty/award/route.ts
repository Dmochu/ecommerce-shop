import { NextRequest, NextResponse } from 'next/server'
import { loyaltyEngine } from '@/lib/loyalty-engine'

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json()

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    const success = await loyaltyEngine.awardPointsForOrder(orderId)

    return NextResponse.json({ success })

  } catch (error) {
    console.error('Error awarding loyalty points:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
