import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { emails, message, referralCode } = await request.json()

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json(
        { error: 'Emails are required' },
        { status: 400 }
      )
    }

    if (!referralCode) {
      return NextResponse.json(
        { error: 'Referral code is required' },
        { status: 400 }
      )
    }

    // W rzeczywistej aplikacji, tutaj byłaby logika wysyłania emaili
    // Na razie tylko logujemy
    console.log('Sending referral invites:', {
      emails,
      message,
      referralCode
    })

    // Można dodać integrację z serwisem email (SendGrid, Mailgun, etc.)
    // const emailService = new EmailService()
    // await emailService.sendReferralInvites(emails, message, referralCode)

    return NextResponse.json({
      success: true,
      message: 'Invites sent successfully',
      sentCount: emails.length
    })

  } catch (error) {
    console.error('Error sending referral invites:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
