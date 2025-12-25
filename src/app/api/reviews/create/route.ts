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
      productId, 
      name, 
      email, 
      rating, 
      title, 
      content,
      pros,
      cons,
      size,
      color,
      isAnonymous
    } = await request.json()

    // Walidacja
    if (!productId || !rating || !title || !content) {
      return NextResponse.json(
        { error: 'Product ID, rating, title and content are required' },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
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

    // Sprawdź czy użytkownik już napisał recenzję dla tego produktu
    if (userId) {
      const existingReview = await prisma.review.findFirst({
        where: {
          productId,
          userId
        }
      })

      if (existingReview) {
        return NextResponse.json(
          { error: 'You have already reviewed this product' },
          { status: 400 }
        )
      }
    }

    // Sprawdź czy gość już napisał recenzję (po email)
    if (!userId && email) {
      const existingGuestReview = await prisma.review.findFirst({
        where: {
          productId,
          email,
          userId: null
        }
      })

      if (existingGuestReview) {
        return NextResponse.json(
          { error: 'A review with this email already exists for this product' },
          { status: 400 }
        )
      }
    }

    // Sprawdź czy użytkownik kupił produkt (dla weryfikacji)
    let verified = false
    if (userId) {
      const order = await prisma.order.findFirst({
        where: {
          userId,
          status: { in: ['CONFIRMED', 'SHIPPED', 'DELIVERED'] },
          items: {
            some: {
              productId
            }
          }
        }
      })
      verified = !!order
    }

    // Utwórz recenzję
    const review = await prisma.review.create({
      data: {
        productId,
        userId: userId || null,
        rating,
        title,
        content,
        name: userId ? null : name, // Dla zalogowanych użytkowników używamy danych z profilu
        email: userId ? null : email,
        verified,
        approved: false, // Wymaga moderacji
        pros: pros || null,
        cons: cons || null,
        size: size || null,
        color: color || null,
        isAnonymous: isAnonymous || false
      },
      include: {
        user: {
          select: {
            name: true,
            firstName: true,
            lastName: true
          }
        }
      }
    })

    return NextResponse.json({
      review,
      message: 'Review submitted successfully. It will be published after moderation.'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
