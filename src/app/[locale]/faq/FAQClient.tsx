'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Search, HelpCircle, ShoppingCart, Truck, CreditCard, RotateCcw, MessageCircle } from 'lucide-react'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
}

const faqData: FAQItem[] = [
  // Zamówienia
  {
    id: '1',
    question: 'Jak złożyć zamówienie?',
    answer: 'Zamówienie możesz złożyć w kilku prostych krokach: 1) Dodaj produkty do koszyka, 2) Przejdź do koszyka i kliknij "Przejdź do kasy", 3) Wypełnij dane dostawy, 4) Wybierz metodę płatności, 5) Potwierdź zamówienie. Po złożeniu zamówienia otrzymasz email z potwierdzeniem.',
    category: 'Zamówienia'
  },
  {
    id: '2',
    question: 'Jak sprawdzić status zamówienia?',
    answer: 'Status zamówienia możesz sprawdzić w sekcji "Śledź zamówienie" w menu głównym. Potrzebujesz numeru zamówienia i adresu email podanego przy składaniu zamówienia. Możesz też zalogować się na swoje konto, aby zobaczyć historię wszystkich zamówień.',
    category: 'Zamówienia'
  },
  {
    id: '3',
    question: 'Czy mogę zmodyfikować lub anulować zamówienie?',
    answer: 'Zamówienia można anulować lub modyfikować tylko w przypadku, gdy nie zostały jeszcze wysłane. Jeśli zamówienie jest już w przygotowaniu, skontaktuj się z nami jak najszybciej pod numerem +48 123 456 789 lub przez formularz kontaktu.',
    category: 'Zamówienia'
  },

  // Dostawa
  {
    id: '4',
    question: 'Jakie są opcje dostawy?',
    answer: 'Oferujemy kilka opcji dostawy: Dostawa standardowa (2-3 dni robocze) - 9,99 zł, Dostawa ekspresowa (24h) - 19,99 zł, Dostawa do paczkomatu InPost - 8,99 zł, Odbiór osobisty w naszym magazynie - GRATIS. Darmowa dostawa przy zamówieniach powyżej 200 zł.',
    category: 'Dostawa'
  },
  {
    id: '5',
    question: 'Jak długo trwa dostawa?',
    answer: 'Standardowy czas dostawy to 2-3 dni robocze. Dostawa ekspresowa (24h) jest dostępna za dodatkową opłatą. Czas dostawy może się wydłużyć w okresach świątecznych lub przy większym obciążeniu kurierów.',
    category: 'Dostawa'
  },
  {
    id: '6',
    question: 'Czy mogę śledzić przesyłkę?',
    answer: 'Tak! Po wysłaniu zamówienia otrzymasz numer śledzenia i link do śledzenia przesyłki. Możesz też sprawdzić status w sekcji "Śledź zamówienie" na naszej stronie.',
    category: 'Dostawa'
  },

  // Płatności
  {
    id: '7',
    question: 'Jakie metody płatności akceptujecie?',
    answer: 'Akceptujemy płatności kartą (Visa, Mastercard), BLIK, przelewem tradycyjnym, płatności online (PayPal, Apple Pay, Google Pay) oraz płatność przy odbiorze (tylko dla dostawy standardowej). Wszystkie płatności są bezpieczne i szyfrowane.',
    category: 'Płatności'
  },
  {
    id: '8',
    question: 'Czy płatności są bezpieczne?',
    answer: 'Tak, wszystkie płatności są szyfrowane i przetwarzane przez sprawdzone systemy płatności. Nie przechowujemy danych kart kredytowych. Używamy najnowszych standardów bezpieczeństwa SSL.',
    category: 'Płatności'
  },
  {
    id: '9',
    question: 'Kiedy zostanie pobrana płatność?',
    answer: 'Płatność jest pobierana natychmiast po złożeniu zamówienia. W przypadku płatności przy odbiorze, płatność następuje przy dostarczeniu przesyłki.',
    category: 'Płatności'
  },

  // Zwroty i reklamacje
  {
    id: '10',
    question: 'Jak zwrócić produkt?',
    answer: 'Masz 14 dni na zwrot produktu od daty dostawy. Aby zwrócić produkt: 1) Wypełnij formularz zwrotu, 2) Spakuj produkt w oryginalne opakowanie, 3) Wyślij do nas na nasz adres. Koszty zwrotu pokrywa klient, chyba że produkt był wadliwy.',
    category: 'Zwroty'
  },
  {
    id: '11',
    question: 'W jakim czasie otrzymam zwrot pieniędzy?',
    answer: 'Po otrzymaniu zwracanego produktu i sprawdzeniu jego stanu, zwrot pieniędzy zostanie przelany w ciągu 3-5 dni roboczych na konto, z którego została dokonana płatność.',
    category: 'Zwroty'
  },
  {
    id: '12',
    question: 'Co zrobić w przypadku reklamacji?',
    answer: 'W przypadku reklamacji skontaktuj się z nami jak najszybciej. Możesz to zrobić przez formularz reklamacji, email lub telefon. Rozpatrujemy reklamacje w ciągu 14 dni roboczych.',
    category: 'Zwroty'
  },

  // Konto i dane
  {
    id: '13',
    question: 'Czy muszę mieć konto, żeby złożyć zamówienie?',
    answer: 'Nie, możesz złożyć zamówienie jako gość. Jednak posiadanie konta daje Ci dostęp do historii zamówień, szybszego składania zamówień i personalizowanych ofert.',
    category: 'Konto'
  },
  {
    id: '14',
    question: 'Jak zmienić dane w moim koncie?',
    answer: 'Zaloguj się na swoje konto i przejdź do sekcji "Mój profil". Tam możesz edytować swoje dane osobowe, adres dostawy i preferencje.',
    category: 'Konto'
  },
  {
    id: '15',
    question: 'Czy moje dane są bezpieczne?',
    answer: 'Tak, dbamy o bezpieczeństwo Twoich danych. Wszystkie dane są szyfrowane i przechowywane zgodnie z RODO. Nie udostępniamy Twoich danych osobom trzecim bez Twojej zgody.',
    category: 'Konto'
  }
]

const categories = [
  { name: 'Wszystkie', icon: HelpCircle },
  { name: 'Zamówienia', icon: ShoppingCart },
  { name: 'Dostawa', icon: Truck },
  { name: 'Płatności', icon: CreditCard },
  { name: 'Zwroty', icon: RotateCcw },
  { name: 'Konto', icon: MessageCircle }
]

export default function FAQClient() {
  const [selectedCategory, setSelectedCategory] = useState('Wszystkie')
  const [searchQuery, setSearchQuery] = useState('')
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())

  const filteredFAQs = faqData.filter(faq => {
    const matchesCategory = selectedCategory === 'Wszystkie' || faq.category === selectedCategory
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id)
    } else {
      newOpenItems.add(id)
    }
    setOpenItems(newOpenItems)
  }

  return (
    <div className="min-h-screen bg-tulinki-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-tulinki-warm mb-2">Najczęściej zadawane pytania</h1>
          <p className="text-tulinki-soft">
            Znajdź odpowiedzi na najczęściej zadawane pytania dotyczące naszego sklepu
          </p>
        </div>

        {/* Wyszukiwarka */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Szukaj w FAQ..."
              className="w-full pl-10 pr-4 py-3 border border-tulinki-rose/30 rounded-lg focus:ring-2 focus:ring-tulinki-rose focus:border-transparent"
            />
          </div>
        </div>

        {/* Kategorie */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === category.name
                      ? 'bg-tulinki-burgundy text-white'
                      : 'bg-white text-tulinki-soft hover:bg-tulinki-rose/20 border border-tulinki-rose/30'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {category.name}
                </button>
              )
            })}
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nie znaleziono pytań spełniających kryteria wyszukiwania</p>
            </div>
          ) : (
            filteredFAQs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white rounded-lg shadow-sm border border-tulinki-rose/20 overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full px-6 py-4 text-left hover:bg-tulinki-beige transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-tulinki-warm pr-4">{faq.question}</h3>
                    {openItems.has(faq.id) ? (
                      <ChevronUp className="h-5 w-5 text-tulinki-burgundy flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-tulinki-burgundy flex-shrink-0" />
                    )}
                  </div>
                </button>
                
                {openItems.has(faq.id) && (
                  <div className="px-6 pb-4">
                    <div className="border-t border-tulinki-rose/20 pt-4">
                      <p className="text-tulinki-soft leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Kontakt */}
        <div className="mt-12 bg-tulinki-burgundy rounded-lg p-6 text-white">
          <h2 className="text-xl font-semibold mb-4">Nie znalazłeś odpowiedzi?</h2>
          <p className="mb-4">
            Jeśli nie znalazłeś odpowiedzi na swoje pytanie, skontaktuj się z nami:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              <span>Live Chat (online)</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">📞</span>
              <span>+48 123 456 789</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">📧</span>
              <span>kontakt@tulinki-store.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
