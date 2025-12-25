import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import EditProductForm from './EditProductForm'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface EditProductPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const resolvedParams = await params

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id: resolvedParams.id },
      include: { category: true }
    }),
    prisma.category.findMany({
      orderBy: { name: 'asc' }
    })
  ])

  if (!product) {
    notFound()
  }

  return <EditProductForm product={product} categories={categories} />
}
