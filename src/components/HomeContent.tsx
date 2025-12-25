'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import BannerSlider from './BannerSlider'
import ProductCard from './ProductCard'
import NewsletterForm from './NewsletterForm'
import { HomeRecommendations } from './ProductRecommendations'

interface HomeContentProps {
  banners: any[]
  popularCategories: any[]
  featuredCategories: any[]
  recommendedProducts: any[]
  featuredProducts: any[]
}

export default function HomeContent({ banners, popularCategories, featuredCategories, recommendedProducts, featuredProducts }: HomeContentProps) {
  const t = useTranslations()
  const locale = useLocale()

  return (
    <div className="min-h-screen bg-tulinki-cream">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Banner Slider */}
        <section className="mb-8">
          <BannerSlider banners={banners} />
        </section>

        {/* Popular Categories */}
        {popularCategories.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-tulinki-warm">
                Popularne Kategorie
              </h2>
              <Link 
                href={`/${locale}/categories`}
                className="text-tulinki-burgundy hover:text-tulinki-wine font-medium transition-colors"
              >
                Zobacz wszystkie →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {popularCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/${locale}/products?category=${category.id}`}
                  className="bg-tulinki-beige p-3 sm:p-4 md:p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 group hover:bg-tulinki-cream border border-tulinki-rose/20 hover:border-tulinki-rose/40 touch-manipulation"
                >
                  <div className="aspect-square bg-gradient-to-br from-tulinki-rose/20 to-tulinki-peach/20 rounded-lg mb-3 sm:mb-4 flex items-center justify-center overflow-hidden">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        loading="lazy"
                        className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <span className="text-tulinki-soft text-sm">Brak zdjęcia</span>
                    )}
                  </div>
                  <h3 className="font-medium text-tulinki-warm mb-1 text-sm sm:text-base group-hover:text-tulinki-burgundy transition-colors">{category.name}</h3>
                  <p className="text-xs sm:text-sm text-tulinki-soft">{category._count.products} produktów</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Featured Categories */}
        {featuredCategories.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-tulinki-warm">
                Wyróżnione Kategorie
              </h2>
              <Link 
                href={`/${locale}/categories`}
                className="text-tulinki-burgundy hover:text-tulinki-wine font-medium transition-colors"
              >
                Zobacz wszystkie →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {featuredCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/${locale}/products?category=${category.id}`}
                  className="bg-gradient-to-br from-tulinki-rose/10 to-tulinki-peach/10 p-3 sm:p-4 md:p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 group hover:bg-gradient-to-br hover:from-tulinki-rose/20 hover:to-tulinki-peach/20 border-2 border-tulinki-rose/30 hover:border-tulinki-rose/50 touch-manipulation"
                >
                  <div className="aspect-square bg-gradient-to-br from-tulinki-rose/20 to-tulinki-peach/20 rounded-lg mb-3 sm:mb-4 flex items-center justify-center overflow-hidden">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        loading="lazy"
                        className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <span className="text-tulinki-soft text-sm">Brak zdjęcia</span>
                    )}
                  </div>
                  <h3 className="font-medium text-tulinki-warm mb-1 text-sm sm:text-base group-hover:text-tulinki-burgundy transition-colors">{category.name}</h3>
                  <p className="text-xs sm:text-sm text-tulinki-soft">{category._count.products} produktów</p>
                  {category.description && (
                    <p className="text-xs text-tulinki-soft mt-1 line-clamp-2 hidden sm:block">{category.description}</p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Recommended Products */}
        {recommendedProducts.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-tulinki-warm">
                Polecane Produkty
              </h2>
              <Link 
                href={`/${locale}/products`}
                className="text-tulinki-burgundy hover:text-tulinki-wine font-medium transition-colors"
              >
                Zobacz wszystkie →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {recommendedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-tulinki-warm">
                Wyróżnione Produkty
              </h2>
              <Link 
                href={`/${locale}/products`}
                className="text-tulinki-burgundy hover:text-tulinki-wine font-medium transition-colors"
              >
                Zobacz wszystkie →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Personalized Recommendations */}
        <section className="mb-12">
          <HomeRecommendations />
        </section>

        {/* Newsletter Section */}
        <section className="mb-12">
          <NewsletterForm 
            source="homepage"
            showFirstName={true}
            showLastName={true}
            className="max-w-2xl mx-auto"
          />
        </section>
      </main>
    </div>
  )
}
