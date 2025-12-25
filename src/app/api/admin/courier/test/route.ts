import { NextRequest, NextResponse } from 'next/server'
import { CourierService } from '@/lib/courier-integration'

export async function POST(request: NextRequest) {
  try {
    const { courier, trackingNumber } = await request.json()

    if (!courier || !trackingNumber) {
      return NextResponse.json(
        { error: 'Courier and tracking number are required' },
        { status: 400 }
      )
    }

    const trackingInfo = await CourierService.trackPackage(courier, trackingNumber)
    
    return NextResponse.json({
      success: true,
      courier,
      trackingNumber,
      trackingInfo
    })

  } catch (error) {
    console.error('Error testing courier integration:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to test courier integration',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
