import { prisma } from '@/lib/prisma'
import OrdersClient from './OrdersClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    select: {
      id: true,
      total: true,
      status: true,
      createdAt: true,
      user: {
        select: {
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
              name: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return <OrdersClient initialOrders={orders} />
}
