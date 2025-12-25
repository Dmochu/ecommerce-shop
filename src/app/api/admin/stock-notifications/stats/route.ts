import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [
      total,
      pending,
      sent,
      todayCount
    ] = await Promise.all([
      prisma.stockNotification.count(),
      prisma.stockNotification.count({
        where: { notified: false }
      }),
      prisma.stockNotification.count({
        where: { notified: true }
      }),
      prisma.stockNotification.count({
        where: {
          createdAt: {
            gte: today
          }
        }
      })
    ])

    return NextResponse.json({
      total,
      pending,
      sent,
      today: todayCount
    })

  } catch (error) {
    console.error('Error fetching stock notification stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
