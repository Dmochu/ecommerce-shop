import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0
import HomeContent from '@/components/HomeContent'

export default async function Home() {
  // Pobierz aktywne banery
  const banners = await prisma.banner.findMany({
    where: { active: true },
    orderBy: { order: 'asc' }
  })

  // Pobierz popularne kategorie
  const popularCategories = await prisma.category.findMany({
    where: { isPopular: true },
    include: {
      _count: {
        select: { products: true }
      }
    },
    take: 4
  })

  // Pobierz wyróżnione kategorie
  const featuredCategories = await prisma.category.findMany({
    where: { isFeatured: true },
    include: {
      _count: {
        select: { products: true }
      }
    },
    take: 4
  })

  // Pobierz polecane produkty
  const recommendedProducts = await prisma.product.findMany({
    where: { isRecommended: true },
    include: {
      category: true
    },
    take: 8
  })

  // Pobierz wyróżnione produkty
  const featuredProducts = await prisma.product.findMany({
    where: { isFeatured: true },
    include: {
      category: true
    },
    take: 8
  })

  return (
    <div>
      <HomeContent 
        banners={banners}
        popularCategories={popularCategories}
        featuredCategories={featuredCategories}
        recommendedProducts={recommendedProducts}
        featuredProducts={featuredProducts}
      />
    </div>
  )
}
