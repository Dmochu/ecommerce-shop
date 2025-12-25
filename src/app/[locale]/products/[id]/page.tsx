import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ProductDetails from '@/components/ProductDetails'

interface ProductPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params
  
  const product = await prisma.product.findUnique({
    where: { id: resolvedParams.id },
    include: {
      category: true
    }
  })

  if (!product) {
    notFound()
  }

  // Pobierz podobne produkty z tej samej kategorii
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id }
    },
    include: {
      category: true
    },
    take: 4
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductDetails product={product} relatedProducts={relatedProducts} />
      </div>
    </div>
  )
}
