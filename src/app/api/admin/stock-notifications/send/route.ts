import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    // Pobierz wszystkie produkty, które są teraz dostępne
    const availableProducts = await prisma.product.findMany({
      where: {
        stock: { gt: 0 }
      },
      select: {
        id: true,
        name: true,
        price: true,
        image: true,
        stock: true
      }
    })

    if (availableProducts.length === 0) {
      return NextResponse.json({
        message: 'No products are currently available',
        sent: 0
      })
    }

    let totalSent = 0

    // Dla każdego dostępnego produktu
    for (const product of availableProducts) {
      // Znajdź wszystkie niepowiadomione subskrypcje dla tego produktu
      const notifications = await prisma.stockNotification.findMany({
        where: {
          productId: product.id,
          notified: false
        },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      })

      if (notifications.length === 0) continue

      // Wyślij powiadomienia (symulacja - w rzeczywistości użyj SendGrid, Nodemailer, etc.)
      for (const notification of notifications) {
        try {
          // TODO: Implement actual email sending
          console.log(`Sending notification to ${notification.email} about ${product.name}`)
          
          // Symulacja wysyłania email
          await new Promise(resolve => setTimeout(resolve, 100))
          
          // Oznacz jako wysłane
          await prisma.stockNotification.update({
            where: { id: notification.id },
            data: {
              notified: true,
              notifiedAt: new Date()
            }
          })
          
          totalSent++
        } catch (error) {
          console.error(`Error sending notification to ${notification.email}:`, error)
        }
      }
    }

    return NextResponse.json({
      message: 'Stock notifications sent successfully',
      sent: totalSent,
      availableProducts: availableProducts.length
    })

  } catch (error) {
    console.error('Error sending stock notifications:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
