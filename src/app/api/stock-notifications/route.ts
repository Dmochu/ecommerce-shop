import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: NextRequest) {
  try {
    const { productId, email } = await request.json()

    if (!productId || !email) {
      return NextResponse.json(
        { error: 'Product ID and email are required' },
        { status: 400 }
      )
    }

    // Sprawdź czy produkt istnieje
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Sprawdź czy produkt jest już dostępny
    if (product.stock > 0) {
      return NextResponse.json(
        { error: 'Product is already available' },
        { status: 400 }
      )
    }

    // Sprawdź autoryzację (opcjonalne)
    const authHeader = request.headers.get('authorization')
    let userId: string | null = null
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as any
        userId = decoded.userId
      } catch (error) {
        // Token nieprawidłowy, kontynuujemy jako gość
        console.log('Invalid token, proceeding as guest')
      }
    }

    // Sprawdź czy powiadomienie już istnieje
    const existingNotification = await prisma.stockNotification.findUnique({
      where: {
        productId_email: {
          productId,
          email
        }
      }
    })

    if (existingNotification) {
      if (existingNotification.notified) {
        return NextResponse.json(
          { error: 'You have already been notified about this product' },
          { status: 400 }
        )
      } else {
        return NextResponse.json(
          { error: 'You are already subscribed to notifications for this product' },
          { status: 400 }
        )
      }
    }

    // Utwórz powiadomienie
    const notification = await prisma.stockNotification.create({
      data: {
        productId,
        email,
        userId: userId || null
      }
    })

    return NextResponse.json({
      message: 'Successfully subscribed to stock notifications',
      notification
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating stock notification:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Sprawdź autoryzację
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    let userId: string

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any
      userId = decoded.userId
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Pobierz powiadomienia użytkownika
    const notifications = await prisma.stockNotification.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            image: true,
            stock: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      notifications
    })

  } catch (error) {
    console.error('Error fetching stock notifications:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
