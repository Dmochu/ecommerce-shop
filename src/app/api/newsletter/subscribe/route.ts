import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, lastName, source = 'homepage' } = await request.json()

    // Walidacja email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Nieprawidłowy adres email' },
        { status: 400 }
      )
    }

    // Sprawdź czy email już istnieje
    const existingSubscriber = await prisma.newsletter.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return NextResponse.json(
          { error: 'Ten adres email jest już zapisany do newslettera' },
          { status: 400 }
        )
      } else {
        // Reaktywuj subskrypcję
        await prisma.newsletter.update({
          where: { id: existingSubscriber.id },
          data: {
            isActive: true,
            firstName: firstName || existingSubscriber.firstName,
            lastName: lastName || existingSubscriber.lastName,
            source,
            unsubscribedAt: null
          }
        })

        return NextResponse.json({
          message: 'Dziękujemy za ponowne zapisanie się do newslettera!',
          reactivated: true
        })
      }
    }

    // Sprawdź czy istnieje użytkownik z tym emailem
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    // Utwórz nową subskrypcję
    const newsletter = await prisma.newsletter.create({
      data: {
        email: email.toLowerCase(),
        firstName: firstName || null,
        lastName: lastName || null,
        source,
        userId: existingUser?.id || null
      }
    })

    // Jeśli użytkownik istnieje, zaktualizuj jego preferencje newslettera
    if (existingUser) {
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { newsletter: true }
      })
    }

    return NextResponse.json({
      message: 'Dziękujemy za zapisanie się do newslettera!',
      newsletter
    }, { status: 201 })

  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas zapisywania do newslettera' },
      { status: 500 }
    )
  }
}
