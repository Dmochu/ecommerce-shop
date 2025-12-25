import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkOrderStatuses } from '@/lib/courier-integration'

export async function POST(request: NextRequest) {
  try {
    const result = await checkOrderStatuses()
    
    return NextResponse.json({
      success: true,
      message: 'Order status check completed',
      result
    })

  } catch (error) {
    console.error('Error checking order statuses:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to check order statuses',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
