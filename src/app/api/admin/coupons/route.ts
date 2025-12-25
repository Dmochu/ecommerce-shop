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
    if (status === 'active') {
      where.isActive = true
      where.OR = [
        { validUntil: null },
        { validUntil: { gte: new Date() } }
      ]
    } else if (status === 'expired') {
      where.validUntil = { lt: new Date() }
    } else if (status === 'inactive') {
      where.isActive = false
    }

    // Wyszukiwanie
    if (search) {
      where.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } }
      ]
    }

    const coupons = await prisma.coupon.findMany({
      where,
      include: {
        orders: {
          select: {
            id: true,
            total: true,
            createdAt: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      coupons
    })

  } catch (error) {
    console.error('Error fetching admin coupons:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      code,
      name,
      description,
      type,
      value,
      minOrderValue,
      maxDiscount,
      usageLimit,
      validFrom,
      validUntil
    } = await request.json()

    // Walidacja
    if (!code || !name || !type || !value) {
      return NextResponse.json(
        { error: 'Code, name, type and value are required' },
        { status: 400 }
      )
    }

    // Sprawdź czy kod już istnieje
    const existingCoupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() }
    })

    if (existingCoupon) {
      return NextResponse.json(
        { error: 'Kupon o tym kodzie już istnieje' },
        { status: 400 }
      )
    }

    // Utwórz kupon
    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        name,
        description,
        type,
        value,
        minOrderValue: minOrderValue || null,
        maxDiscount: maxDiscount || null,
        usageLimit: usageLimit || null,
        validFrom: validFrom ? new Date(validFrom) : null,
        validUntil: validUntil ? new Date(validUntil) : null
      }
    })

    return NextResponse.json({
      coupon
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating coupon:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
