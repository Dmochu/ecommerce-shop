export type StockAvailability = {
  status: 'in-stock' | 'low-stock' | 'very-low-stock' | 'out-of-stock' | 'discontinued'
  label: string
  color: string
  bgColor: string
  borderColor: string
  icon: string
  description: string
}

export function getStockAvailability(stock: number): StockAvailability {
  if (stock <= 0) {
    return {
      status: 'out-of-stock',
      label: 'Brak w magazynie',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      icon: '❌',
      description: 'Produkt niedostępny'
    }
  }
  
  if (stock <= 2) {
    return {
      status: 'very-low-stock',
      label: 'Ostatnie sztuki',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      icon: '⚠️',
      description: 'Bardzo mało sztuk w magazynie'
    }
  }
  
  if (stock <= 5) {
    return {
      status: 'low-stock',
      label: 'Mało sztuk',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      icon: '⚡',
      description: 'Ograniczona dostępność'
    }
  }
  
  if (stock <= 10) {
    return {
      status: 'in-stock',
      label: 'Dostępny',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      icon: '✅',
      description: 'Produkt dostępny'
    }
  }
  
  // Wysoka dostępność (powyżej 10 sztuk)
  return {
    status: 'in-stock',
    label: 'Wysoka dostępność',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-300',
    icon: '🟢',
    description: 'Dużo sztuk w magazynie'
  }
}

export function getStockAvailabilityForTranslations(stock: number, t: (key: string) => string): StockAvailability {
  if (stock <= 0) {
    return {
      status: 'out-of-stock',
      label: t('stock.outOfStock'),
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      icon: '❌',
      description: t('stock.outOfStockDesc')
    }
  }
  
  if (stock <= 2) {
    return {
      status: 'very-low-stock',
      label: t('stock.lastPieces'),
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      icon: '⚠️',
      description: t('stock.lastPiecesDesc')
    }
  }
  
  if (stock <= 5) {
    return {
      status: 'low-stock',
      label: t('stock.lowStock'),
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      icon: '⚡',
      description: t('stock.lowStockDesc')
    }
  }
  
  if (stock <= 10) {
    return {
      status: 'in-stock',
      label: t('stock.inStock'),
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      icon: '✅',
      description: t('stock.inStockDesc')
    }
  }
  
  // Wysoka dostępność (powyżej 10 sztuk)
  return {
    status: 'in-stock',
    label: t('stock.highAvailability'),
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-300',
    icon: '🟢',
    description: t('stock.highAvailabilityDesc')
  }
}
