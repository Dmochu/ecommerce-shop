import { redirect } from 'next/navigation'
import { defaultLocale } from '@/i18n'

export default function RootPage() {
  redirect(`/${defaultLocale}`)
}

export function generateStaticParams() {
  return []
}
