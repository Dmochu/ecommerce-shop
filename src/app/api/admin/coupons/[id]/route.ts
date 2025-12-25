import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const coupon = await prisma.coupon.findUnique({
      where: { id },
      include: {
        orders: {
          select: {
            id: true,
            total: true,
            createdAt: true,
            status: true,
            user: {
              select: {
                name: true,
                email: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!coupon) {
      return NextResponse.json(
        { error: 'Kupon nie znaleziony' },
        { status: 404 }
      )
    }

    return NextResponse.json({ coupon })

  } catch (error) {
    console.error('Error fetching coupon details:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const {
      name,
      description,
      type,
      value,
      minOrderValue,
      maxDiscount,
      usageLimit,
      validFrom,
      validUntil,
      isActive
    } = await request.json()

    const coupon = await prisma.coupon.update({
      where: { id },
      data: {
        name,
        description,
        type,
        value,
        minOrderValue: minOrderValue || null,
        maxDiscount: maxDiscount || null,
        usageLimit: usageLimit || null,
        validFrom: validFrom ? new Date(validFrom) : null,
        validUntil: validUntil ? new Date(validUntil) : null,
        isActive
      }
    })

    return NextResponse.json({ coupon })

  } catch (error) {
    console.error('Error updating coupon:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Sprawdź czy kupon ma zamówienia
    const ordersCount = await prisma.order.count({
      where: { couponId: id }
    })

    if (ordersCount > 0) {
      return NextResponse.json(
        { error: 'Nie można usunąć kuponu, który został już użyty w zamówieniach' },
        { status: 400 }
      )
    }

    await prisma.coupon.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error deleting coupon:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
