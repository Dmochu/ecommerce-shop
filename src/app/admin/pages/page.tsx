import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0
import PagesClient from './PagesClient'

export default async function AdminPagesPage() {
  const pages = await prisma.page.findMany({
    include: {
      modules: {
        orderBy: {
          order: 'asc'
        }
      },
      _count: {
        select: {
          modules: true
        }
    }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return <PagesClient initialPages={pages} />
}
