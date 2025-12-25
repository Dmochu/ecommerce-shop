'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Banner {
  id: string
  title: string
  subtitle?: string | null
  image: string
  link?: string | null
  active: boolean
  order: number
}

interface BannerSliderProps {
  banners: Banner[]
}

export default function BannerSlider({ banners }: BannerSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const activeBanners = banners.filter(banner => banner.active).sort((a, b) => a.order - b.order)

  useEffect(() => {
    if (activeBanners.length <= 1) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeBanners.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [activeBanners.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % activeBanners.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + activeBanners.length) % activeBanners.length)
  }

  if (activeBanners.length === 0) {
    return null
  }

  return (
    <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden rounded-lg shadow-lg border border-tulinki-rose/20">
      {/* Banner Slides */}
      <div className="relative h-full">
        {activeBanners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-300 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="relative h-full">
              <img
                src={banner.image}
                alt={banner.title}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-tulinki-burgundy/60 to-tulinki-wine/40" />
              
              {/* Banner Content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white px-3 sm:px-4">
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold mb-2 sm:mb-4 text-shadow-lg">
                    {banner.title}
                  </h2>
                  {banner.subtitle && (
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-3 sm:mb-6 opacity-90 text-shadow">
                      {banner.subtitle}
                    </p>
                  )}
                  {banner.link && (
                    <Link
                      href={banner.link}
                      className="inline-block bg-tulinki-cream text-tulinki-burgundy px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-tulinki-beige hover:scale-105 transition-all duration-200 shadow-lg border border-tulinki-rose/30 text-sm sm:text-base touch-manipulation"
                    >
                      Sprawdź teraz
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {activeBanners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-tulinki-cream bg-opacity-90 hover:bg-opacity-100 hover:scale-110 p-1.5 sm:p-2 rounded-full transition-all duration-200 cursor-pointer border border-tulinki-rose/30 shadow-sm touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6 text-tulinki-burgundy" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-tulinki-cream bg-opacity-90 hover:bg-opacity-100 hover:scale-110 p-1.5 sm:p-2 rounded-full transition-all duration-200 cursor-pointer border border-tulinki-rose/30 shadow-sm touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6 text-tulinki-burgundy" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {activeBanners.length > 1 && (
        <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1 sm:space-x-2">
          {activeBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all touch-manipulation ${
                index === currentSlide
                  ? 'bg-tulinki-cream shadow-sm'
                  : 'bg-tulinki-cream bg-opacity-50 hover:bg-opacity-75'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
