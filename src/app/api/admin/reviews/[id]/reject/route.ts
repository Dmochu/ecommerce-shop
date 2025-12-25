import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { reason } = await request.json()

    // Sprawdź czy recenzja istnieje
    const review = await prisma.review.findUnique({
      where: { id }
    })

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

    // Odrzuć recenzję
    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        approved: false,
        moderatedAt: new Date(),
        moderationNote: reason
      }
    })

    return NextResponse.json({
      message: 'Review rejected successfully',
      review: updatedReview
    })

  } catch (error) {
    console.error('Error rejecting review:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
