import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/contexts/CartContext";
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { locales } from '@/i18n'

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return {
    title: `Sklep E-commerce - ${locale.toUpperCase()}`,
    description: "Nowoczesny sklep internetowy z szeroką ofertą produktów",
  }
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params
  const messages = await getMessages({ locale })

  console.log('Layout - Locale:', locale)
  console.log('Layout - Messages keys:', Object.keys(messages))

  return (
    <div lang={locale}>
      <NextIntlClientProvider messages={messages}>
        <CartProvider>
          <Header />
          {children}
          <Footer />
        </CartProvider>
      </NextIntlClientProvider>
    </div>
  );
}
