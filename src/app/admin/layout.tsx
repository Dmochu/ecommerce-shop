import Link from 'next/link'
import { 
  Package, 
  Tag, 
  Image, 
  ShoppingBag, 
  Users, 
  BarChart3,
  Settings,
  LogOut,
  Home,
  FileText
} from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Produkty', href: '/admin/products', icon: Package },
    { name: 'Kategorie', href: '/admin/categories', icon: Tag },
    { name: 'Banery', href: '/admin/banners', icon: Image },
    { name: 'Strony', href: '/admin/pages', icon: FileText },
    { name: 'Zamówienia', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Użytkownicy', href: '/admin/users', icon: Users },
    { name: 'Statystyki', href: '/admin/stats', icon: BarChart3 },
    { name: 'Ustawienia', href: '/admin/settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b">
            <Link href="/admin" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Admin</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors group"
              >
                <item.icon className="h-5 w-5 mr-3 text-gray-400 group-hover:text-blue-600" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <Link
              href="/"
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3 text-gray-400" />
              Powrót do sklepu
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        {children}
      </div>
    </div>
  )
}
