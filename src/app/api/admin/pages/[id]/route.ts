import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const { title, slug, description, metaTitle, metaDescription, active } = await request.json()

    // Check if slug already exists (excluding current page)
    if (slug) {
      const existingPage = await prisma.page.findFirst({
        where: { 
          slug,
          id: { not: resolvedParams.id }
        }
      })

      if (existingPage) {
        return NextResponse.json(
          { error: 'Strona o tym adresie już istnieje' },
          { status: 400 }
        )
      }
    }

    const page = await prisma.page.update({
      where: { id: resolvedParams.id },
      data: {
        title,
        slug,
        description,
        metaTitle,
        metaDescription,
        active
      }
    })

    return NextResponse.json(page)
  } catch (error) {
    console.error('Error updating page:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params

    await prisma.page.delete({
      where: { id: resolvedParams.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting page:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
