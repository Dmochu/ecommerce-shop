import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import EditCategoryForm from './EditCategoryForm'

interface EditCategoryPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const resolvedParams = await params

  const category = await prisma.category.findUnique({
    where: { id: resolvedParams.id }
  })

  if (!category) {
    notFound()
  }

  return <EditCategoryForm category={category} />
}
