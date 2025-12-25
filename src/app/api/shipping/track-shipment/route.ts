import { NextRequest, NextResponse } from 'next/server'
import { apaczkaAPI } from '@/lib/apaczka'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const trackingNumber = searchParams.get('trackingNumber')

    if (!trackingNumber) {
      return NextResponse.json(
        { error: 'Tracking number is required' },
        { status: 400 }
      )
    }

    // Sprawdź status przesyłki przez API Apaczki
    const shipmentStatus = await apaczkaAPI.getShipmentStatus(trackingNumber)

    return NextResponse.json({
      success: true,
      status: shipmentStatus
    })

  } catch (error) {
    console.error('Track shipment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
