import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n.ts')

const nextConfig = {
  /* config options here */
  eslint: {
    // Ignoruj ostrzeżenia ESLint podczas buildowania (tylko dla production)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignoruj błędy TypeScript podczas buildowania (tylko ostrzeżenia)
    ignoreBuildErrors: false,
  },
}

export default withNextIntl(nextConfig)
