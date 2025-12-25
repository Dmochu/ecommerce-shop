import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import Link from 'next/link'
import { 
  Package, 
  Tag, 
  Image, 
  ShoppingBag, 
  Users, 
  BarChart3,
  Plus,
  Settings
} from 'lucide-react'

interface AdminStats {
  totalProducts: number
  totalCategories: number
  totalOrders: number
  totalUsers: number
  pendingOrders: number
  totalBanners: number
}

async function getAdminStats(): Promise<AdminStats> {
  const [totalProducts, totalCategories, totalOrders, totalUsers, pendingOrders, totalBanners] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.banner.count()
  ])

  return {
    totalProducts,
    totalCategories,
    totalOrders,
    totalUsers,
    pendingOrders,
    totalBanners
  }
}

export default async function AdminPage() {
  // TODO: Add authentication check for admin role
  // const token = cookies().get('token')?.value
  // if (!token) redirect('/login')
  
  // const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
  // if (decoded.role !== 'ADMIN') redirect('/')

  const stats = await getAdminStats()

  const adminSections = [
    {
      title: 'Produkty',
      description: 'Zarządzaj produktami w sklepie',
      icon: Package,
      href: '/admin/products',
      count: stats.totalProducts,
      color: 'bg-blue-500'
    },
    {
      title: 'Kategorie',
      description: 'Zarządzaj kategoriami produktów',
      icon: Tag,
      href: '/admin/categories',
      count: stats.totalCategories,
      color: 'bg-green-500'
    },
    {
      title: 'Banery',
      description: 'Zarządzaj banerami na stronie głównej',
      icon: Image,
      href: '/admin/banners',
      count: stats.totalBanners,
      color: 'bg-purple-500'
    },
    {
      title: 'Zamówienia',
      description: 'Przeglądaj i zarządzaj zamówieniami',
      icon: ShoppingBag,
      href: '/admin/orders',
      count: stats.totalOrders,
      color: 'bg-orange-500'
    },
    {
      title: 'Użytkownicy',
      description: 'Zarządzaj użytkownikami',
      icon: Users,
      href: '/admin/users',
      count: stats.totalUsers,
      color: 'bg-red-500'
    },
    {
      title: 'Statystyki',
      description: 'Przeglądaj statystyki sklepu',
      icon: BarChart3,
      href: '/admin/stats',
      count: null,
      color: 'bg-indigo-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel Administratora</h1>
          <p className="mt-2 text-gray-600">Zarządzaj swoim sklepem internetowym</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Produkty</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Zamówienia</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                {stats.pendingOrders > 0 && (
                  <p className="text-sm text-orange-600">{stats.pendingOrders} oczekujących</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Użytkownicy</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Tag className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Kategorie</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCategories}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminSections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${section.color} bg-opacity-10`}>
                    <section.icon className={`h-6 w-6 ${section.color.replace('bg-', 'text-')}`} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {section.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                  </div>
                </div>
                {section.count !== null && (
                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {section.count}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Szybkie akcje</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/admin/products/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Dodaj produkt
            </Link>
            <Link
              href="/admin/categories/new"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Dodaj kategorię
            </Link>
            <Link
              href="/admin/banners/new"
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Dodaj baner
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
