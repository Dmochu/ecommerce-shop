import { ShoppingBag, Truck, Shield, Heart, Users, Award } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              O Nas
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Twój zaufany partner w zakupach online. Oferujemy szeroki wybór produktów 
              wysokiej jakości w konkurencyjnych cenach.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Nasza Misja
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Dążymy do tego, aby każdy klient mógł znaleźć dokładnie to, czego szuka, 
              w przyjemnej i bezpiecznej atmosferze. Naszym celem jest dostarczanie 
              produktów najwyższej jakości przy jednoczesnym zapewnieniu doskonałej obsługi klienta.
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Pasja do Klienta
              </h3>
              <p className="text-gray-600">
                Każdy klient jest dla nas ważny. Działamy z pasją i zaangażowaniem, 
                aby zapewnić najlepsze doświadczenia zakupowe.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Bezpieczeństwo
              </h3>
              <p className="text-gray-600">
                Gwarantujemy bezpieczne transakcje i ochronę danych osobowych. 
                Twoje bezpieczeństwo jest naszym priorytetem.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Szybka Dostawa
              </h3>
              <p className="text-gray-600">
                Oferujemy szybką i niezawodną dostawę. Większość zamówień 
                realizujemy w ciągu 24-48 godzin.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Jakość Produktów
              </h3>
              <p className="text-gray-600">
                Współpracujemy tylko z zaufanymi dostawcami, aby zapewnić 
                najwyższą jakość wszystkich produktów.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Wsparcie 24/7
              </h3>
              <p className="text-gray-600">
                Nasz zespół obsługi klienta jest dostępny przez całą dobę, 
                gotowy pomóc w każdej sytuacji.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Szeroki Asortyment
              </h3>
              <p className="text-gray-600">
                Oferujemy tysiące produktów w różnych kategoriach, 
                od elektroniki po artykuły sportowe.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">10K+</div>
              <div className="text-gray-600">Zadowolonych Klientów</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">50K+</div>
              <div className="text-gray-600">Zrealizowanych Zamówień</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">1000+</div>
              <div className="text-gray-600">Produktów w Asortymencie</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-gray-600">Obsługa Klienta</div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Skontaktuj się z Nami
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Masz pytania? Jesteśmy tutaj, aby pomóc! Skontaktuj się z naszym 
              zespołem obsługi klienta.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">kontakt@sklep.pl</p>
              <p className="text-gray-600">support@sklep.pl</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Telefon</h3>
              <p className="text-gray-600">+48 123 456 789</p>
              <p className="text-gray-600">+48 987 654 321</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Adres</h3>
              <p className="text-gray-600">ul. Przykładowa 123</p>
              <p className="text-gray-600">00-000 Warszawa, Polska</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Dołącz do Naszej Społeczności
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Bądź na bieżąco z najnowszymi ofertami i promocjami. 
            Zapisz się do naszego newslettera!
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Zapisz się do Newslettera
          </button>
        </div>
      </div>
    </div>
  )
}
