import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'all'
    const search = searchParams.get('search') || ''

    // Buduj warunki filtrowania
    const where: any = {}

    // Status
    if (status !== 'all') {
      where.status = status.toUpperCase()
    }

    // Wyszukiwanie
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } }
      ]
    }

    const campaigns = await prisma.newsletterCampaign.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      campaigns
    })

  } catch (error) {
    console.error('Error fetching newsletter campaigns:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      name,
      subject,
      content,
      template,
      scheduledAt,
      filters
    } = await request.json()

    // Walidacja
    if (!name || !subject || !content) {
      return NextResponse.json(
        { error: 'Name, subject and content are required' },
        { status: 400 }
      )
    }

    // Utwórz kampanię
    const campaign = await prisma.newsletterCampaign.create({
      data: {
        name,
        subject,
        content,
        template,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        filters: filters || null,
        status: scheduledAt ? 'SCHEDULED' : 'DRAFT'
      }
    })

    return NextResponse.json({
      campaign
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating newsletter campaign:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
