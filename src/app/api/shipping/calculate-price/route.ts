import { NextRequest, NextResponse } from 'next/server'
import { apaczkaAPI, ApaczkaCreateShipmentRequest } from '@/lib/apaczka'

export async function POST(request: NextRequest) {
  try {
    const shipmentData: ApaczkaCreateShipmentRequest = await request.json()

    // Sprawdź wymagane pola
    if (!shipmentData.recipient || !shipmentData.package || !shipmentData.service) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Oblicz cenę przesyłki przez API Apaczki
    const priceCalculation = await apaczkaAPI.calculatePrice(shipmentData)

    return NextResponse.json({
      success: true,
      price: priceCalculation
    })

  } catch (error) {
    console.error('Calculate price error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
