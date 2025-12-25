import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import PageEditor from './PageEditor'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface PageEditPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function PageEditPage({ params }: PageEditPageProps) {
  const resolvedParams = await params

  const page = await prisma.page.findUnique({
    where: { id: resolvedParams.id },
    include: {
      modules: {
        orderBy: {
          order: 'asc'
        }
      }
    }
  })

  if (!page) {
    notFound()
  }

  return <PageEditor page={page} />
}
