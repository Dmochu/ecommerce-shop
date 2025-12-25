import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { isActive } = await request.json()

    const subscriber = await prisma.newsletter.update({
      where: { id: params.id },
      data: {
        isActive: !isActive,
        unsubscribedAt: !isActive ? null : new Date()
      }
    })

    return NextResponse.json({ subscriber })

  } catch (error) {
    console.error('Error toggling newsletter subscriber:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
