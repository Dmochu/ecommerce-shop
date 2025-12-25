'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react'
import NewsletterForm from './NewsletterForm'

export default function Footer() {
  const t = useTranslations()
  const locale = useLocale()

  return (
    <footer className="bg-tulinki-burgundy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Newsletter Section */}
        <div className="mb-8">
          <NewsletterForm 
            source="footer"
            variant="compact"
            className="bg-tulinki-wine/10 border border-tulinki-rose/20"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Aktualności */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-tulinki-cream">{t('footer.news')}</h3>
            <div className="space-y-2">
              <Link href={`/${locale}/news`} className="block text-tulinki-rose hover:text-tulinki-cream transition-colors">
                {t('footer.viewAll')}
              </Link>
            </div>
          </div>

          {/* Na skróty */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-tulinki-cream">{t('footer.quickLinks')}</h3>
            <div className="space-y-2">
              <Link href={`/${locale}/payment-methods`} className="block text-tulinki-rose hover:text-tulinki-cream transition-colors">
                {t('footer.paymentMethods')}
              </Link>
              <Link href={`/${locale}/shipping-costs`} className="block text-tulinki-rose hover:text-tulinki-cream transition-colors">
                {t('footer.shippingCosts')}
              </Link>
              <Link href={`/${locale}/returns`} className="block text-tulinki-rose hover:text-tulinki-cream transition-colors">
                {t('footer.returns')}
              </Link>
              <Link href={`/${locale}/complaint-form`} className="block text-tulinki-rose hover:text-tulinki-cream transition-colors">
                {t('footer.complaintForm')}
              </Link>
              <Link href={`/${locale}/return-form`} className="block text-tulinki-rose hover:text-tulinki-cream transition-colors">
                {t('footer.returnForm')}
              </Link>
            </div>
          </div>

          {/* Firma */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-tulinki-cream">{t('footer.company')}</h3>
            <div className="space-y-2">
              <Link href={`/${locale}/contact`} className="block text-tulinki-rose hover:text-tulinki-cream transition-colors">
                {t('footer.contact')}
              </Link>
              <Link href={`/${locale}/about`} className="block text-tulinki-rose hover:text-tulinki-cream transition-colors">
                {t('footer.about')}
              </Link>
              <Link href={`/${locale}/news`} className="block text-tulinki-rose hover:text-tulinki-cream transition-colors">
                {t('footer.news')}
              </Link>
              <Link href={`/${locale}/privacy-policy`} className="block text-tulinki-rose hover:text-tulinki-cream transition-colors">
                {t('footer.privacyPolicy')}
              </Link>
              <Link href={`/${locale}/terms`} className="block text-tulinki-rose hover:text-tulinki-cream transition-colors">
                {t('footer.terms')}
              </Link>
              <Link href={`/${locale}/contact`} className="block text-tulinki-rose hover:text-tulinki-cream transition-colors">
                {t('footer.contact')}
              </Link>
            </div>
          </div>

          {/* Kontakt */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-tulinki-cream">{t('footer.contact')}</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-tulinki-rose" />
                <a href="mailto:biuro@tulinkimotki.pl" className="text-tulinki-rose hover:text-tulinki-cream transition-colors">
                  biuro@tulinkimotki.pl
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-tulinki-rose" />
                <a href="tel:+48123456789" className="text-tulinki-rose hover:text-tulinki-cream transition-colors">
                  +48 123 456 789
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-tulinki-rose mt-1" />
                <div className="text-tulinki-rose">
                  <p>Test 123</p>
                  <p>00-000 Testowo</p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3 text-tulinki-cream">{t('footer.followUs')}</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-tulinki-rose hover:text-tulinki-cream transition-colors">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="#" className="text-tulinki-rose hover:text-tulinki-cream transition-colors">
                  <Instagram className="h-6 w-6" />
                </a>
                <a href="#" className="text-tulinki-rose hover:text-tulinki-cream transition-colors">
                  <Twitter className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-tulinki-wine mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-tulinki-rose text-sm">
              © 2024 Tulinki Motki. {t('footer.allRightsReserved')}
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href={`/${locale}/privacy-policy`} className="text-tulinki-rose hover:text-tulinki-cream text-sm transition-colors">
                {t('footer.privacy')}
              </Link>
              <Link href={`/${locale}/terms`} className="text-tulinki-rose hover:text-tulinki-cream text-sm transition-colors">
                {t('footer.terms')}
              </Link>
              <Link href={`/${locale}/contact`} className="text-tulinki-rose hover:text-tulinki-cream text-sm transition-colors">
                {t('footer.contact')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
