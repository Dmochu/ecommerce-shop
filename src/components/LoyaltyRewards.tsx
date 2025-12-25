'use client'

import { useState } from 'react'
import { 
  Gift, 
  Star, 
  Crown, 
  Trophy, 
  Zap, 
  Shield, 
  Heart,
  ShoppingBag,
  Truck,
  Percent,
  Coins,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'

interface LoyaltyReward {
  id: string
  name: string
  description?: string
  type: string
  value: number
  pointsCost: number
  isLimited?: boolean
  usageLimit?: number
  usedCount?: number
  validFrom?: string
  validUntil?: string
}

interface LoyaltyRewardsProps {
  rewards: LoyaltyReward[]
  availablePoints: number
  onRedeem: (rewardId: string) => Promise<{ success: boolean; message?: string }>
  loading?: boolean
}

export default function LoyaltyRewards({ 
  rewards, 
  availablePoints, 
  onRedeem, 
  loading = false 
}: LoyaltyRewardsProps) {
  const [redeeming, setRedeeming] = useState<string | null>(null)

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'DISCOUNT':
        return <Percent className="h-5 w-5 text-green-600" />
      case 'FIXED_DISCOUNT':
        return <Coins className="h-5 w-5 text-blue-600" />
      case 'FREE_SHIPPING':
        return <Truck className="h-5 w-5 text-purple-600" />
      case 'GIFT':
        return <Gift className="h-5 w-5 text-pink-600" />
      case 'VOUCHER':
        return <ShoppingBag className="h-5 w-5 text-orange-600" />
      case 'POINTS':
        return <Star className="h-5 w-5 text-yellow-600" />
      default:
        return <Gift className="h-5 w-5 text-gray-600" />
    }
  }

  const getRewardColor = (type: string) => {
    switch (type) {
      case 'DISCOUNT':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'FIXED_DISCOUNT':
        return 'bg-blue-50 border-blue-200 text-blue-800'
      case 'FREE_SHIPPING':
        return 'bg-purple-50 border-purple-200 text-purple-800'
      case 'GIFT':
        return 'bg-pink-50 border-pink-200 text-pink-800'
      case 'VOUCHER':
        return 'bg-orange-50 border-orange-200 text-orange-800'
      case 'POINTS':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  const getRewardValue = (reward: LoyaltyReward) => {
    switch (reward.type) {
      case 'DISCOUNT':
        return `${reward.value}% rabatu`
      case 'FIXED_DISCOUNT':
        return `${reward.value} zł rabatu`
      case 'FREE_SHIPPING':
        return 'Darmowa dostawa'
      case 'GIFT':
        return reward.description || 'Prezent'
      case 'VOUCHER':
        return `Voucher ${reward.value} zł`
      case 'POINTS':
        return `+${reward.value} punktów`
      default:
        return reward.name
    }
  }

  const isRewardAvailable = (reward: LoyaltyReward) => {
    if (availablePoints < reward.pointsCost) return false
    if (reward.isLimited && reward.usedCount && reward.usageLimit && reward.usedCount >= reward.usageLimit) return false
    if (reward.validFrom && new Date(reward.validFrom) > new Date()) return false
    if (reward.validUntil && new Date(reward.validUntil) < new Date()) return false
    return true
  }

  const handleRedeem = async (rewardId: string) => {
    setRedeeming(rewardId)
    try {
      const result = await onRedeem(rewardId)
      if (result.success) {
        // Można dodać toast notification
        console.log('Reward redeemed successfully')
      } else {
        console.error('Failed to redeem reward:', result.message)
      }
    } catch (error) {
      console.error('Error redeeming reward:', error)
    } finally {
      setRedeeming(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Gift className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Dostępne nagrody</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-3"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (rewards.length === 0) {
    return (
      <div className="text-center py-8">
        <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Brak dostępnych nagród</h3>
        <p className="text-gray-500">Zbierz więcej punktów, aby odblokować nagrody!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Gift className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Dostępne nagrody</h3>
        </div>
        <div className="flex items-center space-x-1 text-sm text-gray-600">
          <Coins className="h-4 w-4" />
          <span>{availablePoints} punktów</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rewards.map((reward) => {
          const isAvailable = isRewardAvailable(reward)
          const isRedeeming = redeeming === reward.id

          return (
            <div
              key={reward.id}
              className={`bg-white rounded-lg border-2 p-4 transition-all duration-200 ${
                isAvailable 
                  ? 'border-gray-200 hover:border-blue-300 hover:shadow-md' 
                  : 'border-gray-100 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getRewardIcon(reward.type)}
                  <span className="font-medium text-gray-900">{reward.name}</span>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getRewardColor(reward.type)}`}>
                  {getRewardValue(reward)}
                </div>
              </div>

              {reward.description && (
                <p className="text-sm text-gray-600 mb-3">{reward.description}</p>
              )}

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <Coins className="h-4 w-4" />
                  <span>{reward.pointsCost} punktów</span>
                </div>
                
                {reward.isLimited && reward.usageLimit && (
                  <div className="flex items-center space-x-1 text-xs text-orange-600">
                    <AlertCircle className="h-3 w-3" />
                    <span>{reward.usedCount || 0}/{reward.usageLimit} użyć</span>
                  </div>
                )}
              </div>

              {reward.validUntil && (
                <div className="flex items-center space-x-1 text-xs text-gray-500 mb-3">
                  <Clock className="h-3 w-3" />
                  <span>Ważne do: {new Date(reward.validUntil).toLocaleDateString('pl-PL')}</span>
                </div>
              )}

              <button
                onClick={() => handleRedeem(reward.id)}
                disabled={!isAvailable || isRedeeming}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  isAvailable && !isRedeeming
                    ? 'btn-primary'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isRedeeming ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Wykorzystuję...</span>
                  </div>
                ) : isAvailable ? (
                  'Wykorzystaj nagrodę'
                ) : (
                  'Niedostępne'
                )}
              </button>

              {!isAvailable && availablePoints < reward.pointsCost && (
                <p className="text-xs text-red-500 mt-2 text-center">
                  Potrzebujesz {reward.pointsCost - availablePoints} więcej punktów
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Komponent do wyświetlania benefitów poziomu
export function LoyaltyBenefits({ level, benefits }: { level: any; benefits?: any }) {
  if (!benefits) return null

  const benefitItems = [
    { icon: <Shield className="h-5 w-5" />, text: 'Priorytetowa obsługa' },
    { icon: <Truck className="h-5 w-5" />, text: 'Darmowa dostawa' },
    { icon: <Percent className="h-5 w-5" />, text: 'Dodatkowe rabaty' },
    { icon: <Gift className="h-5 w-5" />, text: 'Ekskluzywne prezenty' },
    { icon: <Star className="h-5 w-5" />, text: 'Wczesny dostęp do nowości' }
  ]

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Crown className="h-6 w-6 text-yellow-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Benefity poziomu {level.name}
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {benefitItems.map((benefit, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="text-blue-600">{benefit.icon}</div>
            <span className="text-sm text-gray-700">{benefit.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
