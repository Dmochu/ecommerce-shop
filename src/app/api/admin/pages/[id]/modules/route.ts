import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const { modules } = await request.json()

    // Delete existing modules
    await prisma.pageModule.deleteMany({
      where: { pageId: resolvedParams.id }
    })

    // Create new modules
    const createdModules = await prisma.pageModule.createMany({
      data: modules.map((module: any, index: number) => ({
        pageId: resolvedParams.id,
        type: module.type,
        title: module.title,
        content: module.content,
        order: index,
        active: module.active
      }))
    })

    return NextResponse.json({ success: true, count: createdModules.count })
  } catch (error) {
    console.error('Error updating modules:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
