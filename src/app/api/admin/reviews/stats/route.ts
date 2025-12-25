import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const [
      total,
      pending,
      approved,
      rejected,
      averageRating
    ] = await Promise.all([
      prisma.review.count(),
      prisma.review.count({
        where: { approved: false, moderatedAt: null }
      }),
      prisma.review.count({
        where: { approved: true }
      }),
      prisma.review.count({
        where: { approved: false, moderatedAt: { not: null } }
      }),
      prisma.review.aggregate({
        where: { approved: true },
        _avg: { rating: true }
      })
    ])

    return NextResponse.json({
      total,
      pending,
      approved,
      rejected,
      averageRating: averageRating._avg.rating || 0
    })

  } catch (error) {
    console.error('Error fetching review stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
