import { NextRequest, NextResponse } from 'next/server'
import { runStockNotificationCron } from '@/lib/stock-notifications'

export async function POST(request: NextRequest) {
  try {
    // Sprawdź czy to jest prawidłowe wywołanie cron job
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET || 'your-cron-secret'
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const result = await runStockNotificationCron()
    
    return NextResponse.json({
      success: true,
      message: 'Stock notification cron job completed',
      result
    })

  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Cron job failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET endpoint for manual testing
export async function GET(request: NextRequest) {
  try {
    const result = await runStockNotificationCron()
    
    return NextResponse.json({
      success: true,
      message: 'Stock notification check completed',
      result
    })

  } catch (error) {
    console.error('Manual check error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Manual check failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
