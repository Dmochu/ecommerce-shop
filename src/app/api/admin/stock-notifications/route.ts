import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'all'
    const search = searchParams.get('search') || ''

    // Buduj warunki filtrowania
    const where: any = {}

    // Status
    if (status === 'pending') {
      where.notified = false
    } else if (status === 'sent') {
      where.notified = true
    }

    // Wyszukiwanie
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { product: { name: { contains: search, mode: 'insensitive' } } }
      ]
    }

    const notifications = await prisma.stockNotification.findMany({
      where,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            image: true,
            stock: true
          }
        },
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      notifications
    })

  } catch (error) {
    console.error('Error fetching admin stock notifications:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
