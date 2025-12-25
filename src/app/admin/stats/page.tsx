import { prisma } from '@/lib/prisma'
import { BarChart3, TrendingUp, Users, ShoppingBag, Package, DollarSign } from 'lucide-react'

export default async function AdminStatsPage() {
  // Pobierz statystyki
  const [
    totalProducts,
    totalCategories,
    totalOrders,
    totalUsers,
    totalRevenue,
    pendingOrders,
    recentOrders,
    topProducts
  ] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.aggregate({
      where: { status: { not: 'CANCELLED' } },
      _sum: { total: true }
    }),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.order.findMany({
      take: 5,
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { product: true } }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5
    })
  ])

  const totalRevenueValue = totalRevenue._sum.total || 0

  const statsCards = [
    {
      title: 'Łączna sprzedaż',
      value: `${totalRevenueValue.toFixed(2)} zł`,
      change: '+12.5%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Zamówienia',
      value: totalOrders.toString(),
      change: '+8.2%',
      changeType: 'positive',
      icon: ShoppingBag,
      color: 'bg-blue-500'
    },
    {
      title: 'Użytkownicy',
      value: totalUsers.toString(),
      change: '+15.3%',
      changeType: 'positive',
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      title: 'Produkty',
      value: totalProducts.toString(),
      change: '+5.1%',
      changeType: 'positive',
      icon: Package,
      color: 'bg-orange-500'
    }
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Statystyki</h1>
        <p className="mt-2 text-gray-600">Przeglądaj statystyki i analizy sklepu</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat) => (
          <div key={stat.title} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${stat.color} bg-opacity-10`}>
                <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className={`text-sm ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} z poprzedniego miesiąca
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Ostatnie zamówienia</h3>
          </div>
          <div className="p-6">
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        #{order.id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.user?.name || order.user?.email || order.guestName || order.guestEmail}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('pl-PL')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {order.total.toFixed(2)} zł
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.items.length} produktów
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">Brak zamówień</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Szybkie statystyki</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Oczekujące zamówienia</span>
                <span className="text-sm font-semibold text-yellow-600">{pendingOrders}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Kategorie produktów</span>
                <span className="text-sm font-semibold text-gray-900">{totalCategories}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Średnia wartość zamówienia</span>
                <span className="text-sm font-semibold text-gray-900">
                  {totalOrders > 0 ? (totalRevenueValue / totalOrders).toFixed(2) : '0.00'} zł
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Produkty bez stanu</span>
                <span className="text-sm font-semibold text-red-600">
                  {/* TODO: Add count of products with stock = 0 */}
                  0
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <BarChart3 className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Wykresy sprzedaży</h3>
        </div>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Wykresy sprzedaży będą dostępne wkrótce</p>
        </div>
      </div>
    </div>
  )
}
