import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [
      totalCoupons,
      activeCoupons,
      expiredCoupons,
      totalUsage,
      totalDiscount
    ] = await Promise.all([
      prisma.coupon.count(),
      prisma.coupon.count({
        where: {
          isActive: true,
          OR: [
            { validUntil: null },
            { validUntil: { gte: new Date() } }
          ]
        }
      }),
      prisma.coupon.count({
        where: {
          validUntil: { lt: new Date() }
        }
      }),
      prisma.coupon.aggregate({
        _sum: { usedCount: true }
      }),
      prisma.order.aggregate({
        where: {
          couponId: { not: null }
        },
        _sum: { discountAmount: true }
      })
    ])

    return NextResponse.json({
      totalCoupons,
      activeCoupons,
      expiredCoupons,
      totalUsage: totalUsage._sum.usedCount || 0,
      totalDiscount: totalDiscount._sum.discountAmount || 0
    })

  } catch (error) {
    console.error('Error fetching coupon stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
