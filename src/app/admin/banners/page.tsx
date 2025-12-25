import { prisma } from '@/lib/prisma'
import BannersClient from './BannersClient'

export default async function AdminBannersPage() {
  const banners = await prisma.banner.findMany({
    orderBy: [
      { order: 'asc' },
      { createdAt: 'desc' }
    ]
  })

  return <BannersClient initialBanners={banners} />
}
