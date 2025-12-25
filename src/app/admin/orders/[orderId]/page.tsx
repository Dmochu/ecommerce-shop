import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import OrderDetailsClient from './OrderDetailsClient'

interface OrderDetailsPageProps {
  params: Promise<{
    orderId: string
  }>
}

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const resolvedParams = await params

  const order = await prisma.order.findUnique({
    where: { id: resolvedParams.orderId },
    select: {
      id: true,
      total: true,
      status: true,
      paymentStatus: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      guestEmail: true,
      guestName: true,
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              image: true
            }
          }
        }
      },
      shippingAddress: true
    }
  })

  if (!order) {
    notFound()
  }

  return <OrderDetailsClient order={order} />
}
