import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'privacy' })
  
  return {
    title: t('title'),
    description: t('description')
  }
}

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'privacy' })

  return (
    <div className="min-h-screen bg-tulinki-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-tulinki-rose/20 p-8">
          <h1 className="text-3xl font-bold text-tulinki-warm mb-8">{t('title')}</h1>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-tulinki-burgundy mb-4">{t('section1.title')}</h2>
              <p className="text-tulinki-soft mb-4">{t('section1.content')}</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-tulinki-burgundy mb-4">{t('section2.title')}</h2>
              <p className="text-tulinki-soft mb-4">{t('section2.content')}</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-tulinki-burgundy mb-4">{t('section3.title')}</h2>
              <p className="text-tulinki-soft mb-4">{t('section3.content')}</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-tulinki-burgundy mb-4">{t('section4.title')}</h2>
              <p className="text-tulinki-soft mb-4">{t('section4.content')}</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-tulinki-burgundy mb-4">{t('section5.title')}</h2>
              <p className="text-tulinki-soft mb-4">{t('section5.content')}</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-tulinki-burgundy mb-4">{t('section6.title')}</h2>
              <p className="text-tulinki-soft mb-4">{t('section6.content')}</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-tulinki-burgundy mb-4">{t('section7.title')}</h2>
              <p className="text-tulinki-soft mb-4">{t('section7.content')}</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-tulinki-burgundy mb-4">{t('section8.title')}</h2>
              <p className="text-tulinki-soft mb-4">{t('section8.content')}</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-tulinki-burgundy mb-4">{t('section9.title')}</h2>
              <p className="text-tulinki-soft mb-4">{t('section9.content')}</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-tulinki-burgundy mb-4">{t('section10.title')}</h2>
              <p className="text-tulinki-soft mb-4">{t('section10.content')}</p>
            </section>

            <div className="mt-12 p-6 bg-tulinki-beige rounded-lg border border-tulinki-rose/20">
              <p className="text-tulinki-soft text-sm">
                {t('lastUpdated')}: {new Date().toLocaleDateString('pl-PL')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
