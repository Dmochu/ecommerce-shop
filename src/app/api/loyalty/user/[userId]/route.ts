import { NextRequest, NextResponse } from 'next/server'
import { loyaltyEngine } from '@/lib/loyalty-engine'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // Znajdź użytkownika w programie lojalnościowym
    const loyaltyUser = await prisma.loyaltyUser.findFirst({
      where: { userId: params.userId },
      include: {
        level: true,
        program: true
      }
    })

    if (!loyaltyUser) {
      return NextResponse.json(
        { error: 'User not enrolled in loyalty program' },
        { status: 404 }
      )
    }

    const userData = await loyaltyEngine.getUserData(loyaltyUser.id)
    const transactions = await loyaltyEngine.getUserTransactions(loyaltyUser.id)
    const rewards = await loyaltyEngine.getAvailableRewards(loyaltyUser.id)

    return NextResponse.json({
      loyaltyUser: userData,
      transactions,
      availableRewards: rewards
    })

  } catch (error) {
    console.error('Error fetching loyalty user data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
