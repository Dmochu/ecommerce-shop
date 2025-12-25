import { NextRequest, NextResponse } from 'next/server'
import { loyaltyEngine } from '@/lib/loyalty-engine'

export async function POST(request: NextRequest) {
  try {
    const { userId, programId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const result = await loyaltyEngine.enrollUser(userId, programId)

    if (!result) {
      return NextResponse.json(
        { error: 'Failed to enroll user in loyalty program' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      loyaltyUser: result
    })

  } catch (error) {
    console.error('Error enrolling user in loyalty program:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
