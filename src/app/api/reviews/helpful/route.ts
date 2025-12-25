import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: NextRequest) {
  try {
    // Sprawdź autoryzację
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    let userId: string

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any
      userId = decoded.userId
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const { reviewId, isHelpful } = await request.json()

    if (!reviewId || typeof isHelpful !== 'boolean') {
      return NextResponse.json(
        { error: 'Review ID and helpful status are required' },
        { status: 400 }
      )
    }

    // Sprawdź czy recenzja istnieje
    const review = await prisma.review.findUnique({
      where: { id: reviewId }
    })

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

    // Sprawdź czy użytkownik już głosował
    const existingVote = await prisma.reviewHelpfulVote.findUnique({
      where: {
        reviewId_userId: {
          reviewId,
          userId
        }
      }
    })

    if (existingVote) {
      // Aktualizuj istniejący głos
      const updatedVote = await prisma.reviewHelpfulVote.update({
        where: {
          reviewId_userId: {
            reviewId,
            userId
          }
        },
        data: {
          isHelpful
        }
      })

      // Aktualizuj licznik helpful w recenzji
      const helpfulCount = await prisma.reviewHelpfulVote.count({
        where: {
          reviewId,
          isHelpful: true
        }
      })

      await prisma.review.update({
        where: { id: reviewId },
        data: { helpful: helpfulCount }
      })

      return NextResponse.json({
        message: 'Vote updated successfully',
        helpful: helpfulCount
      })
    } else {
      // Utwórz nowy głos
      await prisma.reviewHelpfulVote.create({
        data: {
          reviewId,
          userId,
          isHelpful
        }
      })

      // Aktualizuj licznik helpful w recenzji
      const helpfulCount = await prisma.reviewHelpfulVote.count({
        where: {
          reviewId,
          isHelpful: true
        }
      })

      await prisma.review.update({
        where: { id: reviewId },
        data: { helpful: helpfulCount }
      })

      return NextResponse.json({
        message: 'Vote recorded successfully',
        helpful: helpfulCount
      })
    }

  } catch (error) {
    console.error('Error voting on review:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
