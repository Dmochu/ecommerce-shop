'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { ArrowLeft, Send, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function ReturnFormPage() {
  const t = useTranslations('returnForm')
  const locale = useLocale()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    orderNumber: '',
    customerName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Polska',
    isBusiness: false,
    companyName: '',
    nip: '',
    reason: '',
    description: '',
    priority: 'normal',
    preferredContactMethod: 'email',
    orderDate: '',
    returnReason: '',
    refundMethod: 'original',
    items: [{ product: '', quantity: '', condition: '' }]
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Tutaj można dodać logikę wysyłania formularza
    setIsSubmitted(true)
  }

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { product: '', quantity: '', condition: '' }]
    })
  }

  const removeItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    })
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-tulinki-cream">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-sm border border-tulinki-rose/20 p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-tulinki-warm mb-4">{t('success.title')}</h1>
            <p className="text-tulinki-soft mb-6">{t('success.message')}</p>
            <Link 
              href={`/${locale}`}
              className="inline-flex items-center px-4 py-2 bg-tulinki-burgundy text-white rounded-lg hover:bg-tulinki-wine transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('success.backToHome')}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-tulinki-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-tulinki-rose/20 p-8">
          <div className="mb-8">
            <Link 
              href={`/${locale}`}
              className="inline-flex items-center text-tulinki-burgundy hover:text-tulinki-wine mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('backToHome')}
            </Link>
            <h1 className="text-3xl font-bold text-tulinki-warm">{t('title')}</h1>
            <p className="text-tulinki-soft mt-2">{t('description')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Dane zamówienia */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-tulinki-warm mb-2">
                  {t('form.orderNumber')} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.orderNumber}
                  onChange={(e) => setFormData({...formData, orderNumber: e.target.value})}
                  className="w-full px-3 py-2 border border-tulinki-rose/30 rounded-lg focus:ring-2 focus:ring-tulinki-rose focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-tulinki-warm mb-2">
                  {t('form.customerName')} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                  className="w-full px-3 py-2 border border-tulinki-rose/30 rounded-lg focus:ring-2 focus:ring-tulinki-rose focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-tulinki-warm mb-2">
                  {t('form.email')} *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-tulinki-rose/30 rounded-lg focus:ring-2 focus:ring-tulinki-rose focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-tulinki-warm mb-2">
                  {t('form.phone')} *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-tulinki-rose/30 rounded-lg focus:ring-2 focus:ring-tulinki-rose focus:border-transparent"
                />
              </div>
            </div>

            {/* Adres */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-tulinki-warm">Adres</h3>
              <div>
                <label className="block text-sm font-medium text-tulinki-warm mb-2">
                  Adres
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full px-3 py-2 border border-tulinki-rose/30 rounded-lg focus:ring-2 focus:ring-tulinki-rose focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-tulinki-warm mb-2">
                    Miasto
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full px-3 py-2 border border-tulinki-rose/30 rounded-lg focus:ring-2 focus:ring-tulinki-rose focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-tulinki-warm mb-2">
                    Kod pocztowy
                  </label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                    className="w-full px-3 py-2 border border-tulinki-rose/30 rounded-lg focus:ring-2 focus:ring-tulinki-rose focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-tulinki-warm mb-2">
                    Kraj
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    className="w-full px-3 py-2 border border-tulinki-rose/30 rounded-lg focus:ring-2 focus:ring-tulinki-rose focus:border-transparent"
                  >
                    <option value="Polska">Polska</option>
                    <option value="Niemcy">Niemcy</option>
                    <option value="Czechy">Czechy</option>
                    <option value="Słowacja">Słowacja</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Dane biznesowe */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-tulinki-warm">Dane biznesowe</h3>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isBusiness"
                  checked={formData.isBusiness}
                  onChange={(e) => setFormData({...formData, isBusiness: e.target.checked})}
                  className="h-4 w-4 text-tulinki-rose focus:ring-tulinki-rose border-gray-300 rounded"
                />
                <label htmlFor="isBusiness" className="ml-2 text-sm text-tulinki-warm">
                  Jestem firmą
                </label>
              </div>
              
              {formData.isBusiness && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-tulinki-warm mb-2">
                      Nazwa firmy
                    </label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                      className="w-full px-3 py-2 border border-tulinki-rose/30 rounded-lg focus:ring-2 focus:ring-tulinki-rose focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-tulinki-warm mb-2">
                      NIP
                    </label>
                    <input
                      type="text"
                      value={formData.nip}
                      onChange={(e) => setFormData({...formData, nip: e.target.value})}
                      className="w-full px-3 py-2 border border-tulinki-rose/30 rounded-lg focus:ring-2 focus:ring-tulinki-rose focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Powód zwrotu */}
            <div>
              <label className="block text-sm font-medium text-tulinki-warm mb-2">
                {t('form.reason')} *
              </label>
              <select
                required
                value={formData.reason}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
                className="w-full px-3 py-2 border border-tulinki-rose/30 rounded-lg focus:ring-2 focus:ring-tulinki-rose focus:border-transparent"
              >
                <option value="">{t('form.selectReason')}</option>
                <option value="defective">{t('form.reasons.defective')}</option>
                <option value="wrong-item">{t('form.reasons.wrongItem')}</option>
                <option value="not-as-described">{t('form.reasons.notAsDescribed')}</option>
                <option value="changed-mind">{t('form.reasons.changedMind')}</option>
                <option value="other">{t('form.reasons.other')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-tulinki-warm mb-2">
                {t('form.description')} *
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-tulinki-rose/30 rounded-lg focus:ring-2 focus:ring-tulinki-rose focus:border-transparent"
                placeholder={t('form.descriptionPlaceholder')}
              />
            </div>

            {/* Dodatkowe opcje zwrotu */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-tulinki-warm">Opcje zwrotu</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-tulinki-warm mb-2">
                    Metoda zwrotu środków
                  </label>
                  <select
                    value={formData.refundMethod}
                    onChange={(e) => setFormData({...formData, refundMethod: e.target.value})}
                    className="w-full px-3 py-2 border border-tulinki-rose/30 rounded-lg focus:ring-2 focus:ring-tulinki-rose focus:border-transparent"
                  >
                    <option value="original">Na oryginalny sposób płatności</option>
                    <option value="bank">Przelew bankowy</option>
                    <option value="store_credit">Kredyt sklepowy</option>
                    <option value="voucher">Voucher</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-tulinki-warm mb-2">
                    Priorytet zwrotu
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    className="w-full px-3 py-2 border border-tulinki-rose/30 rounded-lg focus:ring-2 focus:ring-tulinki-rose focus:border-transparent"
                  >
                    <option value="low">Niski</option>
                    <option value="normal">Normalny</option>
                    <option value="high">Wysoki</option>
                    <option value="urgent">Pilny</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-tulinki-warm mb-2">
                    Preferowana metoda kontaktu
                  </label>
                  <select
                    value={formData.preferredContactMethod}
                    onChange={(e) => setFormData({...formData, preferredContactMethod: e.target.value})}
                    className="w-full px-3 py-2 border border-tulinki-rose/30 rounded-lg focus:ring-2 focus:ring-tulinki-rose focus:border-transparent"
                  >
                    <option value="email">Email</option>
                    <option value="phone">Telefon</option>
                    <option value="sms">SMS</option>
                    <option value="post">Poczta</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-tulinki-warm mb-2">
                    Data zamówienia
                  </label>
                  <input
                    type="date"
                    value={formData.orderDate}
                    onChange={(e) => setFormData({...formData, orderDate: e.target.value})}
                    className="w-full px-3 py-2 border border-tulinki-rose/30 rounded-lg focus:ring-2 focus:ring-tulinki-rose focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Produkty do zwrotu */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-tulinki-warm">{t('form.items.title')}</h3>
                <button
                  type="button"
                  onClick={addItem}
                  className="px-4 py-2 btn-secondary"
                >
                  {t('form.items.addItem')}
                </button>
              </div>

              {formData.items.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-tulinki-beige rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-tulinki-warm mb-2">
                      {t('form.items.product')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={item.product}
                      onChange={(e) => {
                        const newItems = [...formData.items]
                        newItems[index].product = e.target.value
                        setFormData({...formData, items: newItems})
                      }}
                      className="w-full px-3 py-2 border border-tulinki-rose/30 rounded-lg focus:ring-2 focus:ring-tulinki-rose focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-tulinki-warm mb-2">
                      {t('form.items.quantity')} *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={item.quantity}
                      onChange={(e) => {
                        const newItems = [...formData.items]
                        newItems[index].quantity = e.target.value
                        setFormData({...formData, items: newItems})
                      }}
                      className="w-full px-3 py-2 border border-tulinki-rose/30 rounded-lg focus:ring-2 focus:ring-tulinki-rose focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-tulinki-warm mb-2">
                      {t('form.items.condition')} *
                    </label>
                    <select
                      required
                      value={item.condition}
                      onChange={(e) => {
                        const newItems = [...formData.items]
                        newItems[index].condition = e.target.value
                        setFormData({...formData, items: newItems})
                      }}
                      className="w-full px-3 py-2 border border-tulinki-rose/30 rounded-lg focus:ring-2 focus:ring-tulinki-rose focus:border-transparent"
                    >
                      <option value="">{t('form.items.selectCondition')}</option>
                      <option value="new">{t('form.items.conditions.new')}</option>
                      <option value="used">{t('form.items.conditions.used')}</option>
                      <option value="damaged">{t('form.items.conditions.damaged')}</option>
                    </select>
                  </div>
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="mt-2 px-3 py-1 btn-danger text-sm"
                    >
                      {t('form.items.remove')}
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-6 py-3 bg-tulinki-burgundy text-white rounded-lg hover:bg-tulinki-wine transition-colors"
              >
                <Send className="h-4 w-4 mr-2" />
                {t('form.submit')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
