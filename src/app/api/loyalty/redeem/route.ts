import { NextRequest, NextResponse } from 'next/server'
import { loyaltyEngine } from '@/lib/loyalty-engine'

export async function POST(request: NextRequest) {
  try {
    const { loyaltyUserId, rewardId } = await request.json()

    if (!loyaltyUserId || !rewardId) {
      return NextResponse.json(
        { error: 'Loyalty user ID and reward ID are required' },
        { status: 400 }
      )
    }

    const result = await loyaltyEngine.redeemReward(loyaltyUserId, rewardId)

    return NextResponse.json(result)

  } catch (error) {
    console.error('Error redeeming loyalty reward:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
