import { getRequestConfig } from 'next-intl/server'
import { locales, defaultLocale, type Locale } from '../i18n'

// Re-export the constants for use in middleware
export { locales, defaultLocale, type Locale }

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  }
})
