import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'all'
    const rating = searchParams.get('rating') || 'all'
    const search = searchParams.get('search') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const skip = (page - 1) * limit

    // Buduj warunki filtrowania
    const where: any = {}

    // Status
    if (status === 'pending') {
      where.approved = false
    } else if (status === 'approved') {
      where.approved = true
    } else if (status === 'rejected') {
      where.approved = false
      where.moderatedAt = { not: null }
    }

    // Ocena
    if (rating !== 'all') {
      where.rating = parseInt(rating)
    }

    // Wyszukiwanie
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
        { product: { name: { contains: search, mode: 'insensitive' } } }
      ]
    }

    const [reviews, totalCount] = await Promise.all([
      prisma.review.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          product: {
            select: {
              id: true,
              name: true,
              image: true
            }
          },
          user: {
            select: {
              name: true,
              email: true
            }
          },
          replies: {
            select: {
              id: true,
              content: true,
              isOfficial: true,
              createdAt: true
            },
            orderBy: {
              createdAt: 'asc'
            }
          }
        }
      }),
      prisma.review.count({ where })
    ])

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching admin reviews:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
