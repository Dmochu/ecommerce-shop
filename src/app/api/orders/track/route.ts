import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { orderNumber, email } = await request.json()

    if (!orderNumber || !email) {
      return NextResponse.json(
        { error: 'Order number and email are required' },
        { status: 400 }
      )
    }

    // Znajdź zamówienie po numerze i emailu
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          // Dla zalogowanych użytkowników
          {
            id: orderNumber,
            user: {
              email: email
            }
          },
          // Dla gości
          {
            id: orderNumber,
            guestEmail: email
          }
        ]
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                image: true
              }
            }
          }
        },
        shippingAddress: true,
        statusHistory: {
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found. Please check your order number and email.' },
        { status: 404 }
      )
    }

    // Przygotuj dane do zwrócenia
    const orderData = {
      id: order.id,
      status: order.status,
      total: order.total,
      createdAt: order.createdAt,
      trackingNumber: order.trackingNumber,
      courier: order.courier,
      estimatedDelivery: order.estimatedDelivery,
      actualDelivery: order.actualDelivery,
      deliveryNotes: order.deliveryNotes,
      trackingUrl: order.trackingUrl,
      statusHistory: order.statusHistory.map(status => ({
        id: status.id,
        status: status.status,
        note: status.note,
        createdAt: status.createdAt
      })),
      items: order.items.map(item => ({
        id: item.id,
        product: {
          name: item.product.name,
          image: item.product.image
        },
        quantity: item.quantity,
        price: item.price
      })),
      shippingAddress: order.shippingAddress ? {
        name: order.shippingAddress.name,
        address: order.shippingAddress.address,
        city: order.shippingAddress.city,
        postalCode: order.shippingAddress.postalCode,
        country: order.shippingAddress.country,
        phone: order.shippingAddress.phone
      } : null
    }

    return NextResponse.json({
      order: orderData
    })

  } catch (error) {
    console.error('Error tracking order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
