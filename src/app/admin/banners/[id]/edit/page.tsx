import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import EditBannerForm from './EditBannerForm'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface EditBannerPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditBannerPage({ params }: EditBannerPageProps) {
  const resolvedParams = await params

  const banner = await prisma.banner.findUnique({
    where: { id: resolvedParams.id }
  })

  if (!banner) {
    notFound()
  }

  return <EditBannerForm banner={banner} />
}
