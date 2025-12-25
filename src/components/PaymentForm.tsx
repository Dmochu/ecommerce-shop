'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { CreditCard, Lock, CheckCircle, XCircle } from 'lucide-react'

// Załaduj Stripe (klucz publiczny)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PaymentFormProps {
  orderId: string
  amount: number
  clientSecret: string
}

function CheckoutForm({ orderId, amount }: { orderId: string; amount: number }) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)
    setMessage('')

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success?orderId=${orderId}`,
      },
      redirect: 'if_required',
    })

    if (error) {
      setMessage(error.message || 'Wystąpił błąd podczas płatności')
      setIsSuccess(false)
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      setMessage('Płatność zakończona pomyślnie!')
      setIsSuccess(true)
      setTimeout(() => {
        router.push(`/payment/success?orderId=${orderId}`)
      }, 2000)
    }

    setIsLoading(false)
  }

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informacje o zamówieniu */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Kwota do zapłaty:</span>
            <span className="text-lg font-semibold text-gray-900">
              {amount.toFixed(2)} zł
            </span>
          </div>
        </div>

        {/* Formularz płatności */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">
              Dane płatności
            </h3>
          </div>
          
          <PaymentElement />
        </div>

        {/* Komunikat */}
        {message && (
          <div className={`p-4 rounded-lg flex items-center ${
            isSuccess 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {isSuccess ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <XCircle className="h-5 w-5 mr-2" />
            )}
            {message}
          </div>
        )}

        {/* Przycisk płatności */}
        <button
          type="submit"
          disabled={!stripe || isLoading}
          className="w-full btn-primary py-3 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Przetwarzanie...
            </>
          ) : (
            <>
              <Lock className="h-5 w-5 mr-2" />
              Zapłać {amount.toFixed(2)} zł
            </>
          )}
        </button>

        {/* Informacja o bezpieczeństwie */}
        <div className="text-center text-sm text-gray-500">
          <div className="flex items-center justify-center">
            <Lock className="h-4 w-4 mr-1" />
            Płatność jest bezpieczna i szyfrowana
          </div>
          <p className="mt-1">
            Twoje dane są chronione przez SSL i nie są przechowywane na naszych serwerach
          </p>
        </div>
      </form>
    </div>
  )
}

export default function PaymentForm({ orderId, amount, clientSecret }: PaymentFormProps) {
  const [isStripeLoaded, setIsStripeLoaded] = useState(false)

  useEffect(() => {
    setIsStripeLoaded(true)
  }, [])

  if (!isStripeLoaded) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#2563eb',
          },
        },
      }}
    >
      <CheckoutForm orderId={orderId} amount={amount} />
    </Elements>
  )
}
