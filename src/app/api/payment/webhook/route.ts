import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature || !webhookSecret) {
      return NextResponse.json(
        { error: 'Missing signature or webhook secret' },
        { status: 400 }
      )
    }

    let event

    try {
      const stripe = getStripe()
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Obsługa różnych typów zdarzeń
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object)
        break
      
      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object)
        break
      
      case 'payment_intent.canceled':
        await handlePaymentCanceled(event.data.object)
        break
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function handlePaymentSuccess(paymentIntent: any) {
  const orderId = paymentIntent.metadata.orderId

  if (orderId) {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'PAID',
        status: 'CONFIRMED'
      }
    })

    console.log(`Payment succeeded for order: ${orderId}`)
  }
}

async function handlePaymentFailure(paymentIntent: any) {
  const orderId = paymentIntent.metadata.orderId

  if (orderId) {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'FAILED'
      }
    })

    console.log(`Payment failed for order: ${orderId}`)
  }
}

async function handlePaymentCanceled(paymentIntent: any) {
  const orderId = paymentIntent.metadata.orderId

  if (orderId) {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'FAILED',
        status: 'CANCELLED'
      }
    })

    console.log(`Payment canceled for order: ${orderId}`)
  }
}
