import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { CheckCircle, Package, ArrowRight } from 'lucide-react'

interface PaymentSuccessPageProps {
  searchParams: Promise<{
    orderId?: string
  }>
}

export default async function PaymentSuccessPage({ searchParams }: PaymentSuccessPageProps) {
  const params = await searchParams
  const orderId = params.orderId

  if (!orderId) {
    notFound()
  }

  // Pobierz zamówienie
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: true
        }
      },
      user: true
    }
  })

  if (!order) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center px-4">
        {/* Ikona sukcesu */}
        <div className="bg-green-100 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>

        {/* Tytuł */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Płatność zakończona pomyślnie!
        </h1>

        {/* Informacje o zamówieniu */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-center mb-4">
            <Package className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">
              Zamówienie #{order.id.slice(-8).toUpperCase()}
            </h2>
          </div>

          <div className="space-y-2 text-gray-600">
            <p>Kwota: <span className="font-semibold text-gray-900">{order.total.toFixed(2)} zł</span></p>
            <p>Status: <span className="font-semibold text-green-600">Opłacone</span></p>
            <p>Data: <span className="font-semibold text-gray-900">
              {new Date(order.createdAt).toLocaleDateString('pl-PL')}
            </span></p>
          </div>

          {/* Lista produktów */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h3 className="font-medium text-gray-900 mb-3">Zamówione produkty:</h3>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {item.product.name} (x{item.quantity})
                  </span>
                  <span className="font-medium text-gray-900">
                    {(item.price * item.quantity).toFixed(2)} zł
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Komunikat */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800">
            Dziękujemy za zakupy! Potwierdzenie zamówienia zostało wysłane na adres{' '}
            <span className="font-semibold">{order.user?.email || order.guestEmail}</span>.
          </p>
          <p className="text-blue-700 text-sm mt-2">
            Będziemy informować Cię o statusie wysyłki.
          </p>
        </div>

        {/* Przyciski akcji */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/profile"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Package className="h-5 w-5 mr-2" />
            Zobacz zamówienia
            <ArrowRight className="h-5 w-5 ml-2" />
          </Link>
          
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Kontynuuj zakupy
          </Link>
        </div>
      </div>
    </div>
  )
}
