import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { code, orderValue } = await request.json()

    if (!code || !orderValue) {
      return NextResponse.json(
        { error: 'Code and order value are required' },
        { status: 400 }
      )
    }

    // Znajdź kupon
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() }
    })

    if (!coupon) {
      return NextResponse.json(
        { error: 'Kod kuponu nie istnieje' },
        { status: 404 }
      )
    }

    // Sprawdź czy kupon jest aktywny
    if (!coupon.isActive) {
      return NextResponse.json(
        { error: 'Kupon nie jest aktywny' },
        { status: 400 }
      )
    }

    // Sprawdź daty ważności
    const now = new Date()
    if (coupon.validFrom && now < coupon.validFrom) {
      return NextResponse.json(
        { error: 'Kupon nie jest jeszcze ważny' },
        { status: 400 }
      )
    }

    if (coupon.validUntil && now > coupon.validUntil) {
      return NextResponse.json(
        { error: 'Kupon wygasł' },
        { status: 400 }
      )
    }

    // Sprawdź limit użyć
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json(
        { error: 'Kupon został już wykorzystany' },
        { status: 400 }
      )
    }

    // Sprawdź minimalną wartość zamówienia
    if (coupon.minOrderValue && orderValue < coupon.minOrderValue) {
      return NextResponse.json(
        { error: `Minimalna wartość zamówienia: ${coupon.minOrderValue} zł` },
        { status: 400 }
      )
    }

    // Oblicz rabat
    let discount = 0
    switch (coupon.type) {
      case 'PERCENTAGE':
        discount = (orderValue * coupon.value) / 100
        if (coupon.maxDiscount) {
          discount = Math.min(discount, coupon.maxDiscount)
        }
        break
      case 'FIXED_AMOUNT':
        discount = Math.min(coupon.value, orderValue)
        break
      case 'FREE_SHIPPING':
        discount = 0 // Darmowa dostawa - rabat będzie zastosowany przy dostawie
        break
    }

    return NextResponse.json({
      coupon: {
        id: coupon.id,
        code: coupon.code,
        name: coupon.name,
        type: coupon.type,
        value: coupon.value,
        discount: discount,
        description: coupon.description
      }
    })

  } catch (error) {
    console.error('Error validating coupon:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
