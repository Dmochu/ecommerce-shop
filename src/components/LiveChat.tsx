'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, X, Send, User, Bot, Phone, Mail, Clock } from 'lucide-react'

interface ChatMessage {
  id: string
  type: 'user' | 'bot'
  message: string
  timestamp: Date
  isTyping?: boolean
}

interface LiveChatProps {
  isOpen: boolean
  onClose: () => void
}

export default function LiveChat({ isOpen, onClose }: LiveChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  // Automatyczne powitanie
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: '1',
        type: 'bot',
        message: 'Cześć! 👋 Jak możemy Ci pomóc?',
        timestamp: new Date()
      }
      setMessages([welcomeMessage])
    }
  }, [isOpen, messages.length])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!inputMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Symulacja odpowiedzi bota
    setTimeout(() => {
      const botResponse = getBotResponse(inputMessage)
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        message: botResponse,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 1000 + Math.random() * 2000) // 1-3 sekundy opóźnienia
  }

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()
    
    // Automatyczne odpowiedzi - rozszerzone
    if (message.includes('status') || message.includes('zamówienie') || message.includes('śledzenie')) {
      return 'Aby sprawdzić status zamówienia, przejdź do sekcji "Śledź zamówienie" w menu głównym. Potrzebujesz numeru zamówienia i adresu email. Możesz też zalogować się na swoje konto, aby zobaczyć historię wszystkich zamówień.'
    }
    
    if (message.includes('zwrot') || message.includes('reklamacja') || message.includes('reklamacj')) {
      return 'W przypadku zwrotu lub reklamacji, skorzystaj z formularza zwrotu dostępnego w menu głównym. Masz 14 dni na zwrot produktu od daty dostawy. Nasz zespół skontaktuje się z Tobą w ciągu 24 godzin.'
    }
    
    if (message.includes('dostawa') || message.includes('wysyłka') || message.includes('kurier')) {
      return 'Standardowy czas dostawy to 2-3 dni robocze. Ekspresowa dostawa (24h) jest dostępna za dodatkową opłatą. Oferujemy dostawę do paczkomatu InPost, kurierem DHL/UPS oraz odbiór osobisty. Szczegóły znajdziesz w koszyku podczas składania zamówienia.'
    }
    
    if (message.includes('płatność') || message.includes('płatności') || message.includes('karta') || message.includes('blik')) {
      return 'Akceptujemy płatności kartą (Visa, Mastercard), BLIK, przelewem tradycyjnym oraz płatności online (PayPal, Apple Pay, Google Pay). Wszystkie płatności są bezpieczne i szyfrowane. Możesz też zapłacić przy odbiorze.'
    }
    
    if (message.includes('kontakt') || message.includes('telefon') || message.includes('email')) {
      return 'Możesz skontaktować się z nami: 📞 +48 123 456 789 📧 kontakt@tulinki-store.com 🕒 Pon-Pt: 9:00-17:00. Możesz też skorzystać z formularza kontaktu lub napisać do nas przez ten chat.'
    }
    
    if (message.includes('cena') || message.includes('koszt') || message.includes('ile kosztuje')) {
      return 'Ceny produktów znajdziesz na stronach produktów. Oferujemy darmową dostawę przy zamówieniach powyżej 200 zł. Regularnie organizujemy promocje i rabaty - śledź nasze social media!'
    }
    
    if (message.includes('konto') || message.includes('rejestracja') || message.includes('logowanie')) {
      return 'Możesz zarejestrować się klikając ikonę użytkownika w prawym górnym rogu. Konto nie jest wymagane do składania zamówień, ale daje dostęp do historii zamówień i szybszego składania zamówień.'
    }
    
    if (message.includes('faq') || message.includes('pytania') || message.includes('pomoc')) {
      return 'Wszystkie najczęściej zadawane pytania znajdziesz w sekcji FAQ w menu głównym. Tam znajdziesz odpowiedzi na pytania dotyczące zamówień, dostawy, płatności i zwrotów.'
    }
    
    if (message.includes('dziękuję') || message.includes('dzięki') || message.includes('dziekuje')) {
      return 'Proszę bardzo! 😊 Czy mogę pomóc w czymś jeszcze? Jeśli masz inne pytania, śmiało pytaj!'
    }
    
    if (message.includes('cześć') || message.includes('witaj') || message.includes('dzień dobry') || message.includes('hej')) {
      return 'Cześć! 👋 Miło Cię poznać! Jak możemy Ci pomóc? Możesz zapytać o zamówienia, dostawę, płatności lub cokolwiek innego!'
    }
    
    if (message.includes('godziny') || message.includes('otwarte') || message.includes('czynne')) {
      return 'Jesteśmy dostępni: 🕒 Poniedziałek-Piątek: 9:00-17:00, Sobota: 10:00-14:00, Niedziela: nieczynne. Online jesteśmy 24/7 - możesz składać zamówienia o każdej porze!'
    }
    
    if (message.includes('promocja') || message.includes('rabat') || message.includes('zniżka')) {
      return 'Regularnie organizujemy promocje i rabaty! Śledź nasze social media i newsletter, aby nie przegapić najlepszych ofert. Czasami mamy też specjalne kody rabatowe!'
    }
    
    // Domyślna odpowiedź z sugestiami
    return 'Dziękuję za wiadomość! 🤖 Mogę pomóc Ci z: zamówieniami, dostawą, płatnościami, zwrotami, reklamacjami. Jeśli nie znalazłeś odpowiedzi, nasz zespół obsługi klienta skontaktuje się z Tobą w ciągu kilku minut. Możesz też sprawdzić nasze FAQ!'
  }

  const quickActions = [
    { label: 'Status zamówienia', action: 'Jak sprawdzić status zamówienia?' },
    { label: 'Zwrot/Reklamacja', action: 'Chcę zwrócić produkt' },
    { label: 'Dostawa', action: 'Jakie są opcje dostawy?' },
    { label: 'Kontakt', action: 'Jak się z wami skontaktować?' }
  ]

  if (!isOpen) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`bg-white rounded-lg shadow-lg border border-gray-200 transition-all duration-300 ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
      }`}>
        {/* Header */}
        <div className="bg-tulinki-burgundy text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span className="font-semibold">Pomoc online</span>
            <span className="bg-green-400 w-2 h-2 rounded-full"></span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              {isMinimized ? '↑' : '↓'}
            </button>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[80%] ${
                    message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === 'user' 
                        ? 'bg-tulinki-burgundy text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    <div className={`px-3 py-2 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-tulinki-burgundy text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <p className="text-sm">{message.message}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString('pl-PL', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="p-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">Szybkie akcje:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => setInputMessage(action.action)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded transition-colors"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Napisz wiadomość..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tulinki-rose focus:border-transparent text-sm"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="p-2 bg-tulinki-burgundy text-white rounded-lg hover:bg-tulinki-wine disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
