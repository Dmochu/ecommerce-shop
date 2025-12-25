import StockNotificationsClient from './StockNotificationsClient'

export default function AdminStockNotificationsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Powiadomienia o dostępności</h1>
          <p className="mt-2 text-gray-600">
            Zarządzaj powiadomieniami o dostępności produktów
          </p>
        </div>
        
        <StockNotificationsClient />
      </div>
    </div>
  )
}
