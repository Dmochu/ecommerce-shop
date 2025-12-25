import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

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

    // Zatwierdź recenzję
    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        approved: true,
        moderatedAt: new Date()
      }
    })

    return NextResponse.json({
      message: 'Review approved successfully',
      review: updatedReview
    })

  } catch (error) {
    console.error('Error approving review:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
