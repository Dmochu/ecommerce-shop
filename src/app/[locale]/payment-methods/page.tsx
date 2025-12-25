import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { ArrowLeft, CreditCard, Smartphone, Shield, Clock, CheckCircle } from 'lucide-react'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'paymentMethods' })
  
  return {
    title: t('title'),
    description: t('description')
  }
}

export default async function PaymentMethodsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'paymentMethods' })

  return (
    <div className="min-h-screen bg-tulinki-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-tulinki-rose/20 p-8">
          <div className="mb-8">
            <Link 
              href={`/${locale}`}
              className="inline-flex items-center text-tulinki-burgundy hover:text-tulinki-wine mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('backToHome')}
            </Link>
            <h1 className="text-3xl font-bold text-tulinki-warm">{t('title')}</h1>
            <p className="text-tulinki-soft mt-2">{t('description')}</p>
          </div>

          {/* Payment Methods */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-tulinki-burgundy mb-6">{t('methods.title')}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Credit Cards */}
              <div className="p-6 bg-tulinki-beige rounded-lg border border-tulinki-rose/20">
                <div className="flex items-center mb-4">
                  <CreditCard className="h-8 w-8 text-tulinki-burgundy mr-3" />
                  <h3 className="text-lg font-semibold text-tulinki-warm">{t('methods.creditCards.title')}</h3>
                </div>
                <p className="text-tulinki-soft mb-4">{t('methods.creditCards.description')}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-tulinki-rose text-white rounded-full text-sm">Visa</span>
                  <span className="px-3 py-1 bg-tulinki-rose text-white rounded-full text-sm">Mastercard</span>
                  <span className="px-3 py-1 bg-tulinki-rose text-white rounded-full text-sm">American Express</span>
                </div>
              </div>

              {/* Mobile Payments */}
              <div className="p-6 bg-tulinki-beige rounded-lg border border-tulinki-rose/20">
                <div className="flex items-center mb-4">
                  <Smartphone className="h-8 w-8 text-tulinki-burgundy mr-3" />
                  <h3 className="text-lg font-semibold text-tulinki-warm">{t('methods.mobilePayments.title')}</h3>
                </div>
                <p className="text-tulinki-soft mb-4">{t('methods.mobilePayments.description')}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-tulinki-rose text-white rounded-full text-sm">Apple Pay</span>
                  <span className="px-3 py-1 bg-tulinki-rose text-white rounded-full text-sm">Google Pay</span>
                  <span className="px-3 py-1 bg-tulinki-rose text-white rounded-full text-sm">Samsung Pay</span>
                </div>
              </div>

              {/* Bank Transfer */}
              <div className="p-6 bg-tulinki-beige rounded-lg border border-tulinki-rose/20">
                <div className="flex items-center mb-4">
                  <Shield className="h-8 w-8 text-tulinki-burgundy mr-3" />
                  <h3 className="text-lg font-semibold text-tulinki-warm">{t('methods.bankTransfer.title')}</h3>
                </div>
                <p className="text-tulinki-soft mb-4">{t('methods.bankTransfer.description')}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-tulinki-rose text-white rounded-full text-sm">Przelew tradycyjny</span>
                  <span className="px-3 py-1 bg-tulinki-rose text-white rounded-full text-sm">BLIK</span>
                </div>
              </div>

              {/* Cash on Delivery */}
              <div className="p-6 bg-tulinki-beige rounded-lg border border-tulinki-rose/20">
                <div className="flex items-center mb-4">
                  <Clock className="h-8 w-8 text-tulinki-burgundy mr-3" />
                  <h3 className="text-lg font-semibold text-tulinki-warm">{t('methods.cashOnDelivery.title')}</h3>
                </div>
                <p className="text-tulinki-soft mb-4">{t('methods.cashOnDelivery.description')}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-tulinki-rose text-white rounded-full text-sm">Gotówka</span>
                  <span className="px-3 py-1 bg-tulinki-rose text-white rounded-full text-sm">Karta przy odbiorze</span>
                </div>
              </div>
            </div>
          </section>

          {/* Security */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-tulinki-burgundy mb-6">{t('security.title')}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-tulinki-beige rounded-lg">
                <Shield className="h-12 w-12 text-tulinki-burgundy mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-tulinki-warm mb-2">{t('security.ssl.title')}</h3>
                <p className="text-tulinki-soft">{t('security.ssl.content')}</p>
              </div>
              
              <div className="text-center p-6 bg-tulinki-beige rounded-lg">
                <CheckCircle className="h-12 w-12 text-tulinki-burgundy mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-tulinki-warm mb-2">{t('security.verification.title')}</h3>
                <p className="text-tulinki-soft">{t('security.verification.content')}</p>
              </div>
              
              <div className="text-center p-6 bg-tulinki-beige rounded-lg">
                <CreditCard className="h-12 w-12 text-tulinki-burgundy mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-tulinki-warm mb-2">{t('security.encryption.title')}</h3>
                <p className="text-tulinki-soft">{t('security.encryption.content')}</p>
              </div>
            </div>
          </section>

          {/* Payment Process */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-tulinki-burgundy mb-6">{t('process.title')}</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-tulinki-burgundy text-white rounded-full flex items-center justify-center font-semibold">1</div>
                <div>
                  <h3 className="text-lg font-semibold text-tulinki-warm mb-2">{t('process.step1.title')}</h3>
                  <p className="text-tulinki-soft">{t('process.step1.content')}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-tulinki-burgundy text-white rounded-full flex items-center justify-center font-semibold">2</div>
                <div>
                  <h3 className="text-lg font-semibold text-tulinki-warm mb-2">{t('process.step2.title')}</h3>
                  <p className="text-tulinki-soft">{t('process.step2.content')}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-tulinki-burgundy text-white rounded-full flex items-center justify-center font-semibold">3</div>
                <div>
                  <h3 className="text-lg font-semibold text-tulinki-warm mb-2">{t('process.step3.title')}</h3>
                  <p className="text-tulinki-soft">{t('process.step3.content')}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-tulinki-burgundy text-white rounded-full flex items-center justify-center font-semibold">4</div>
                <div>
                  <h3 className="text-lg font-semibold text-tulinki-warm mb-2">{t('process.step4.title')}</h3>
                  <p className="text-tulinki-soft">{t('process.step4.content')}</p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="bg-tulinki-beige rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-tulinki-burgundy mb-6">{t('faq.title')}</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-tulinki-warm mb-2">{t('faq.question1.title')}</h3>
                <p className="text-tulinki-soft">{t('faq.question1.answer')}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-tulinki-warm mb-2">{t('faq.question2.title')}</h3>
                <p className="text-tulinki-soft">{t('faq.question2.answer')}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-tulinki-warm mb-2">{t('faq.question3.title')}</h3>
                <p className="text-tulinki-soft">{t('faq.question3.answer')}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-tulinki-warm mb-2">{t('faq.question4.title')}</h3>
                <p className="text-tulinki-soft">{t('faq.question4.answer')}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
