import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const sortBy = searchParams.get('sortBy') || 'newest' // newest, oldest, helpful, rating
    const rating = searchParams.get('rating') // filtrowanie po ocenie

    const skip = (page - 1) * limit

    // Buduj warunki filtrowania
    const where: any = {
      productId,
      approved: true // Tylko zatwierdzone recenzje
    }

    if (rating) {
      where.rating = parseInt(rating)
    }

    // Buduj sortowanie
    let orderBy: any = {}
    switch (sortBy) {
      case 'oldest':
        orderBy = { createdAt: 'asc' }
        break
      case 'helpful':
        orderBy = { helpful: 'desc' }
        break
      case 'rating':
        orderBy = { rating: 'desc' }
        break
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' }
        break
    }

    // Pobierz recenzje
    const [reviews, totalCount] = await Promise.all([
      prisma.review.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              name: true,
              firstName: true,
              lastName: true
            }
          },
          helpfulVotes: {
            select: {
              userId: true,
              isHelpful: true
            }
          },
          replies: {
            include: {
              user: {
                select: {
                  name: true
                }
              }
            },
            orderBy: {
              createdAt: 'asc'
            }
          }
        }
      }),
      prisma.review.count({ where })
    ])

    // Oblicz statystyki
    const stats = await prisma.review.aggregate({
      where: {
        productId,
        approved: true
      },
      _avg: {
        rating: true
      },
      _count: {
        rating: true
      }
    })

    // Rozkład ocen
    const ratingDistribution = await prisma.review.groupBy({
      by: ['rating'],
      where: {
        productId,
        approved: true
      },
      _count: {
        rating: true
      }
    })

    const ratingCounts = ratingDistribution.reduce((acc, item) => {
      acc[item.rating] = item._count.rating
      return acc
    }, {} as Record<number, number>)

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      },
      stats: {
        averageRating: stats._avg.rating || 0,
        totalReviews: stats._count.rating,
        ratingDistribution: {
          5: ratingCounts[5] || 0,
          4: ratingCounts[4] || 0,
          3: ratingCounts[3] || 0,
          2: ratingCounts[2] || 0,
          1: ratingCounts[1] || 0
        }
      }
    })

  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
