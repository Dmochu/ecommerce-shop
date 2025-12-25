import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/ProductCard'
import CategoryFilter from '@/components/CategoryFilter'
import AdvancedFilters from '@/components/AdvancedFilters'
import SearchResults from '@/components/SearchResults'
import { searchProducts, searchProductsWithFilters } from '@/lib/search'

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string
    search?: string
    minPrice?: string
    maxPrice?: string
    inStock?: string
    sort?: string
    order?: string
  }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams
  
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  })

  let products: any[] = []

  // Sprawdź czy są jakieś filtry zaawansowane
  const hasAdvancedFilters = params.minPrice || params.maxPrice || params.inStock

  if (params.search || hasAdvancedFilters) {
    // Użyj zaawansowanego wyszukiwania z filtrami
    const filters = {
      categoryId: params.category,
      minPrice: params.minPrice ? parseFloat(params.minPrice) : undefined,
      maxPrice: params.maxPrice ? parseFloat(params.maxPrice) : undefined,
      inStock: params.inStock === 'true'
    }

    if (params.search) {
      const sortBy = params.sort || 'relevance'
      const sortOrder = (params.order as 'asc' | 'desc') || 'desc'
      products = await searchProductsWithFilters(params.search, filters, 50, sortBy, sortOrder)
    } else {
      // Tylko filtry bez wyszukiwania
      const sortBy = params.sort || 'createdAt'
      const sortOrder = (params.order as 'asc' | 'desc') || 'desc'
      
      let orderBy: any = {}
      if (sortBy === 'name') {
        orderBy.name = sortOrder
      } else if (sortBy === 'price') {
        orderBy.price = sortOrder
      } else if (sortBy === 'createdAt') {
        orderBy.createdAt = sortOrder
      } else {
        orderBy.createdAt = 'desc'
      }

      const baseProducts = await prisma.product.findMany({
        where: {
          ...(params.category && { categoryId: params.category }),
          ...(filters.minPrice !== undefined && { price: { gte: filters.minPrice } }),
          ...(filters.maxPrice !== undefined && { price: { lte: filters.maxPrice } }),
          ...(filters.inStock && { stock: { gt: 0 } })
        },
        include: {
          category: true
        },
        orderBy
      })
      products = baseProducts
    }
  } else {
    // Standardowe pobieranie produktów
    const whereClause: any = {}
    
    if (params.category) {
      whereClause.categoryId = params.category
    }

    const sortBy = params.sort || 'createdAt'
    const sortOrder = (params.order as 'asc' | 'desc') || 'desc'
    
    let orderBy: any = {}
    if (sortBy === 'name') {
      orderBy.name = sortOrder
    } else if (sortBy === 'price') {
      orderBy.price = sortOrder
    } else if (sortBy === 'createdAt') {
      orderBy.createdAt = sortOrder
    } else {
      orderBy.createdAt = 'desc'
    }

    products = await prisma.product.findMany({
      where: whereClause,
      include: {
        category: true
      },
      orderBy
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar z filtrami */}
          <div className="lg:w-64 space-y-6">
            <CategoryFilter 
              categories={categories} 
              selectedCategory={params.category}
            />
            <AdvancedFilters 
              categories={categories}
              totalResults={products.length}
            />
          </div>

          {/* Lista produktów */}
          <div className="flex-1">
            <SearchResults 
              totalResults={products.length}
              searchQuery={params.search}
            >
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </SearchResults>
          </div>
        </div>
      </div>
    </div>
  )
}
