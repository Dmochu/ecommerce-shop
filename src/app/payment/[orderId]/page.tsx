import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import PaymentForm from '@/components/PaymentForm'

interface PaymentPageProps {
  params: Promise<{
    orderId: string
  }>
}

export default async function PaymentPage({ params }: PaymentPageProps) {
  const resolvedParams = await params

  // Pobierz zamówienie
  const order = await prisma.order.findUnique({
    where: { id: resolvedParams.orderId },
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

  // Sprawdź czy zamówienie nie zostało już opłacone
  if (order.paymentStatus === 'PAID') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Zamówienie już opłacone</h1>
          <p className="text-gray-600 mb-6">
            To zamówienie zostało już opłacone. Sprawdź status w swoim profilu.
          </p>
          <Link
            href="/profile"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Przejdź do profilu
          </Link>
        </div>
      </div>
    )
  }

  // Utwórz Payment Intent
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/payment/create-payment-intent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ orderId: order.id }),
  })

  if (!response.ok) {
    throw new Error('Failed to create payment intent')
  }

  const { clientSecret } = await response.json()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Finalizacja zamówienia
          </h1>
          <p className="text-gray-600">
            Zamówienie #{order.id.slice(-8).toUpperCase()}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Podsumowanie zamówienia */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Podsumowanie zamówienia
            </h2>
            
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-lg object-cover mr-3"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Ilość: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-medium text-gray-900">
                    {(item.price * item.quantity).toFixed(2)} zł
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Razem:</span>
                <span>{order.total.toFixed(2)} zł</span>
              </div>
            </div>
          </div>

          {/* Formularz płatności */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Płatność
            </h2>
            
            <PaymentForm
              orderId={order.id}
              amount={order.total}
              clientSecret={clientSecret}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
