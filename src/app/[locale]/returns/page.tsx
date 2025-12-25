import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { ArrowLeft, Clock, Shield, Truck, RefreshCw } from 'lucide-react'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'returns' })
  
  return {
    title: t('title'),
    description: t('description')
  }
}

export default async function ReturnsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'returns' })

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

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Link 
              href={`/${locale}/return-form`}
              className="p-6 bg-tulinki-beige rounded-lg border border-tulinki-rose/20 hover:border-tulinki-rose/40 transition-all group"
            >
              <RefreshCw className="h-8 w-8 text-tulinki-burgundy mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold text-tulinki-warm mb-2">{t('quickActions.returnForm.title')}</h3>
              <p className="text-tulinki-soft">{t('quickActions.returnForm.description')}</p>
            </Link>

            <Link 
              href={`/${locale}/complaint-form`}
              className="p-6 bg-tulinki-beige rounded-lg border border-tulinki-rose/20 hover:border-tulinki-rose/40 transition-all group"
            >
              <Shield className="h-8 w-8 text-tulinki-burgundy mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold text-tulinki-warm mb-2">{t('quickActions.complaintForm.title')}</h3>
              <p className="text-tulinki-soft">{t('quickActions.complaintForm.description')}</p>
            </Link>
          </div>

          {/* Return Policy */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-tulinki-burgundy mb-6">{t('returnPolicy.title')}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-tulinki-beige rounded-lg">
                <Clock className="h-12 w-12 text-tulinki-burgundy mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-tulinki-warm mb-2">{t('returnPolicy.timeframe.title')}</h3>
                <p className="text-tulinki-soft">{t('returnPolicy.timeframe.content')}</p>
              </div>
              
              <div className="text-center p-6 bg-tulinki-beige rounded-lg">
                <Shield className="h-12 w-12 text-tulinki-burgundy mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-tulinki-warm mb-2">{t('returnPolicy.conditions.title')}</h3>
                <p className="text-tulinki-soft">{t('returnPolicy.conditions.content')}</p>
              </div>
              
              <div className="text-center p-6 bg-tulinki-beige rounded-lg">
                <Truck className="h-12 w-12 text-tulinki-burgundy mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-tulinki-warm mb-2">{t('returnPolicy.shipping.title')}</h3>
                <p className="text-tulinki-soft">{t('returnPolicy.shipping.content')}</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <h3 className="text-xl font-semibold text-tulinki-burgundy mb-4">{t('returnPolicy.details.title')}</h3>
              <ul className="list-disc list-inside text-tulinki-soft space-y-2">
                <li>{t('returnPolicy.details.item1')}</li>
                <li>{t('returnPolicy.details.item2')}</li>
                <li>{t('returnPolicy.details.item3')}</li>
                <li>{t('returnPolicy.details.item4')}</li>
                <li>{t('returnPolicy.details.item5')}</li>
              </ul>
            </div>
          </section>

          {/* Complaint Process */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-tulinki-burgundy mb-6">{t('complaintProcess.title')}</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-tulinki-burgundy text-white rounded-full flex items-center justify-center font-semibold">1</div>
                <div>
                  <h3 className="text-lg font-semibold text-tulinki-warm mb-2">{t('complaintProcess.step1.title')}</h3>
                  <p className="text-tulinki-soft">{t('complaintProcess.step1.content')}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-tulinki-burgundy text-white rounded-full flex items-center justify-center font-semibold">2</div>
                <div>
                  <h3 className="text-lg font-semibold text-tulinki-warm mb-2">{t('complaintProcess.step2.title')}</h3>
                  <p className="text-tulinki-soft">{t('complaintProcess.step2.content')}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-tulinki-burgundy text-white rounded-full flex items-center justify-center font-semibold">3</div>
                <div>
                  <h3 className="text-lg font-semibold text-tulinki-warm mb-2">{t('complaintProcess.step3.title')}</h3>
                  <p className="text-tulinki-soft">{t('complaintProcess.step3.content')}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-tulinki-burgundy text-white rounded-full flex items-center justify-center font-semibold">4</div>
                <div>
                  <h3 className="text-lg font-semibold text-tulinki-warm mb-2">{t('complaintProcess.step4.title')}</h3>
                  <p className="text-tulinki-soft">{t('complaintProcess.step4.content')}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Info */}
          <section className="bg-tulinki-beige rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-tulinki-burgundy mb-4">{t('contact.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-tulinki-warm mb-2">{t('contact.email.title')}</h3>
                <p className="text-tulinki-soft mb-2">{t('contact.email.content')}</p>
                <a href="mailto:biuro@tulinkimotki.pl" className="text-tulinki-burgundy hover:text-tulinki-wine">
                  biuro@tulinkimotki.pl
                </a>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-tulinki-warm mb-2">{t('contact.phone.title')}</h3>
                <p className="text-tulinki-soft mb-2">{t('contact.phone.content')}</p>
                <a href="tel:+48123456789" className="text-tulinki-burgundy hover:text-tulinki-wine">
                  +48 123 456 789
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
