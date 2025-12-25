import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Nieprawidłowy adres email' },
        { status: 400 }
      )
    }

    // Znajdź subskrybenta
    const subscriber = await prisma.newsletter.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!subscriber) {
      return NextResponse.json(
        { error: 'Ten adres email nie jest zapisany do newslettera' },
        { status: 404 }
      )
    }

    if (!subscriber.isActive) {
      return NextResponse.json(
        { error: 'Ten adres email jest już wypisany z newslettera' },
        { status: 400 }
      )
    }

    // Wypisz z newslettera
    await prisma.newsletter.update({
      where: { id: subscriber.id },
      data: {
        isActive: false,
        unsubscribedAt: new Date()
      }
    })

    // Jeśli to użytkownik, zaktualizuj jego preferencje
    if (subscriber.userId) {
      await prisma.user.update({
        where: { id: subscriber.userId },
        data: { newsletter: false }
      })
    }

    return NextResponse.json({
      message: 'Zostałeś wypisany z newslettera'
    })

  } catch (error) {
    console.error('Newsletter unsubscription error:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas wypisywania z newslettera' },
      { status: 500 }
    )
  }
}
