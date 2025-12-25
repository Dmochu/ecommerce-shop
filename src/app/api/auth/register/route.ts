import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { 
      email, 
      password, 
      name, 
      firstName, 
      lastName, 
      phone, 
      dateOfBirth, 
      gender, 
      address, 
      city, 
      postalCode, 
      country, 
      isBusiness, 
      companyName, 
      nip, 
      newsletter, 
      smsMarketing, 
      preferredLanguage 
    } = await request.json()

    // Validate input
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { message: 'Email, hasło, imię i nazwisko są wymagane' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Hasło musi mieć co najmniej 6 znaków' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'Użytkownik z tym adresem email już istnieje' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || `${firstName} ${lastName}`,
        firstName,
        lastName,
        phone,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender: gender || null,
        address,
        city,
        postalCode,
        country: country || 'Polska',
        isBusiness: isBusiness || false,
        companyName,
        nip,
        newsletter: newsletter || false,
        smsMarketing: smsMarketing || false,
        preferredLanguage: preferredLanguage || 'pl'
      },
      select: {
        id: true,
        email: true,
        name: true,
        firstName: true,
        lastName: true,
        role: true
      }
    })

    return NextResponse.json(
      { message: 'Konto zostało utworzone pomyślnie', user },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { message: 'Wystąpił błąd podczas rejestracji' },
      { status: 500 }
    )
  }
}
