import { NextRequest, NextResponse } from 'next/server'
import { apaczkaAPI } from '@/lib/apaczka'

export async function GET(request: NextRequest) {
  try {
    // Pobierz dostępne usługi kurierskie
    const services = await apaczkaAPI.getAvailableServices()

    return NextResponse.json({
      success: true,
      services
    })

  } catch (error) {
    console.error('Get services error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
