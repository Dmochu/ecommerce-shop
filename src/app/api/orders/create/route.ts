import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: NextRequest) {
  try {
    // Sprawdź autoryzację (opcjonalne dla gości)
    const authHeader = request.headers.get('authorization')
    let userId: string | null = null
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as any
        userId = decoded.userId
      } catch (error) {
        // Token nieprawidłowy, ale kontynuujemy jako gość
        console.log('Invalid token, proceeding as guest')
      }
    }

    const { 
      items, 
      guestEmail, 
      guestName, 
      guestPhone, 
      guestAddress, 
      guestCity, 
      guestPostalCode, 
      guestCountry,
      wantsInvoice,
      invoiceData 
    } = await request.json()

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Items are required' },
        { status: 400 }
      )
    }

    // Sprawdź czy produkty istnieją i mają wystarczający stan magazynowy
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      })

      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 404 }
        )
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for product ${product.name}` },
          { status: 400 }
        )
      }
    }

    // Oblicz całkowitą kwotę
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    // Sprawdź czy dla gości podano wymagane dane
    if (!userId && (!guestEmail || !guestName || !guestPhone || !guestAddress || !guestCity || !guestPostalCode)) {
      return NextResponse.json(
        { error: 'Guest email, name, phone, address, city and postal code are required for guest checkout' },
        { status: 400 }
      )
    }

    // Utwórz zamówienie w transakcji
    const order = await prisma.$transaction(async (tx) => {
      // Utwórz zamówienie
      const order = await tx.order.create({
        data: {
          userId: userId,
          total,
          status: 'PENDING',
          paymentStatus: 'PENDING',
          guestEmail: userId ? null : guestEmail,
          guestName: userId ? null : guestName,
          guestPhone: userId ? null : guestPhone,
          guestAddress: userId ? null : guestAddress,
          guestCity: userId ? null : guestCity,
          guestPostalCode: userId ? null : guestPostalCode,
          guestCountry: userId ? null : (guestCountry || 'Polska'),
          wantsInvoice: wantsInvoice || false,
          invoiceData: invoiceData ? JSON.stringify(invoiceData) : null
        }
      })

      // Utwórz elementy zamówienia
      await tx.orderItem.createMany({
        data: items.map(item => ({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        }))
      })

      // Zaktualizuj stan magazynowy
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        })
      }

      return order
    })

    return NextResponse.json({
      orderId: order.id,
      message: 'Order created successfully'
    })

  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
