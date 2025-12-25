import { prisma } from '@/lib/prisma'
import ProductsClient from './ProductsClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return <ProductsClient initialProducts={products} />
}
