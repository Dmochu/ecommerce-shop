import { NextRequest, NextResponse } from 'next/server'
import { apaczkaAPI, ApaczkaCreateShipmentRequest } from '@/lib/apaczka'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: NextRequest) {
  try {
    // Sprawdź autoryzację
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    let decoded: any

    try {
      decoded = jwt.verify(token, JWT_SECRET)
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const { orderId } = await request.json()

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    // Pobierz zamówienie z bazy danych
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true
          }
        },
        user: true,
        shippingAddress: true
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    if (!order.shippingAddress) {
      return NextResponse.json(
        { error: 'Shipping address not found' },
        { status: 400 }
      )
    }

    // Oblicz wagę i wymiary paczki
    const totalWeight = order.items.reduce((sum, item) => {
      // Zakładamy, że każdy produkt waży 0.5kg (można to dodać do modelu Product)
      return sum + (item.quantity * 0.5)
    }, 0)

    // Przygotuj dane przesyłki
    const shipmentData: ApaczkaCreateShipmentRequest = {
      sender: {
        name: 'Sklep Online',
        email: 'sklep@example.com',
        phone: '+48 123 456 789',
        address: 'ul. Przykładowa 1',
        city: 'Warszawa',
        postalCode: '00-000',
        country: 'Polska'
      },
      recipient: {
        name: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
        email: order.shippingAddress.email,
        phone: order.shippingAddress.phone,
        address: order.shippingAddress.address,
        city: order.shippingAddress.city,
        postalCode: order.shippingAddress.postalCode,
        country: order.shippingAddress.country
      },
      package: {
        weight: Math.max(totalWeight, 0.1), // minimum 0.1kg
        length: 20, // cm
        width: 15, // cm
        height: 10, // cm
        description: `Zamówienie #${order.id}`
      },
      service: 'inpost' // domyślna usługa
    }

    // Utwórz przesyłkę przez API Apaczki
    const shipmentResult = await apaczkaAPI.createShipment(shipmentData)

    if (!shipmentResult.success) {
      return NextResponse.json(
        { error: shipmentResult.error || 'Failed to create shipment' },
        { status: 500 }
      )
    }

    // Zaktualizuj zamówienie z informacjami o przesyłce
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'SHIPPED',
        // Można dodać pola do przechowywania informacji o przesyłce
        // shipmentId: shipmentResult.shipmentId,
        // trackingNumber: shipmentResult.trackingNumber
      }
    })

    return NextResponse.json({
      success: true,
      shipmentId: shipmentResult.shipmentId,
      trackingNumber: shipmentResult.trackingNumber,
      labelUrl: shipmentResult.labelUrl
    })

  } catch (error) {
    console.error('Create shipment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
