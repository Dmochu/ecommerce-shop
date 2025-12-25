import { prisma } from '@/lib/prisma'
import CategoriesClient from './CategoriesClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          products: true
        }
      }
    },
    orderBy: {
      name: 'asc'
    }
  })

  return <CategoriesClient initialCategories={categories} />
}
