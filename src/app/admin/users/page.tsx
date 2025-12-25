import { prisma } from '@/lib/prisma'
import UsersClient from './UsersClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: {
          orders: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return <UsersClient initialUsers={users} />
}
