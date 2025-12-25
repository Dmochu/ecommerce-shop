'use client'

import { useState, useEffect } from 'react'
import { useLoyalty } from '@/hooks/useLoyalty'
import LoyaltyRewards, { LoyaltyBenefits } from '@/components/LoyaltyRewards'
import ReferralProgram, { ReferralHistory } from '@/components/ReferralProgram'
import { 
  Star, 
  Trophy, 
  Coins, 
  Gift, 
  TrendingUp, 
  Calendar,
  ShoppingBag,
  Crown,
  Target,
  Zap,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'

export default function LoyaltyDashboard() {
  const [userId, setUserId] = useState<string | null>(null)
  const { 
    loyaltyUser, 
    transactions, 
    rewards, 
    loading, 
    error, 
    enrollInProgram, 
    redeemReward 
  } = useLoyalty(userId || undefined)

  useEffect(() => {
    // W rzeczywistej aplikacji, userId byłby pobierany z sesji/autentykacji
    // Na razie używamy localStorage lub można przekazać jako prop
    const storedUserId = localStorage.getItem('userId')
    if (storedUserId) {
      setUserId(storedUserId)
    }
  }, [])

  const handleEnroll = async () => {
    if (userId) {
      await enrollInProgram()
    }
  }

  const handleRedeem = async (rewardId: string) => {
    return await redeemReward(rewardId)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-6">
                <div className="h-48 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Błąd ładowania</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!loyaltyUser) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <Crown className="h-16 w-16 text-blue-600 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Program Lojalnościowy Tulinki
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Dołącz do naszego programu lojalnościowego i zbieraj punkty za każdy zakup. 
              Wymieniaj punkty na rabaty, prezenty i ekskluzywne benefity!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <Coins className="h-8 w-8 text-yellow-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Zbieraj punkty</h3>
                <p className="text-gray-600">1 zł = 1 punkt. Im więcej wydajesz, tym więcej punktów zbierasz!</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <Trophy className="h-8 w-8 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Awansuj poziomami</h3>
                <p className="text-gray-600">Bronze → Silver → Gold. Każdy poziom to nowe benefity!</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <Gift className="h-8 w-8 text-pink-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Wykorzystuj nagrody</h3>
                <p className="text-gray-600">Rabaty, prezenty, darmowa dostawa - wybierz co chcesz!</p>
              </div>
            </div>

            <button
              onClick={handleEnroll}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Dołącz do programu
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Program Lojalnościowy
              </h1>
              <p className="text-gray-600 mt-2">
                Witaj w programie lojalnościowym Tulinki!
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Ostatnia aktywność: {new Date().toLocaleDateString('pl-PL')}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Level Card */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-full ${
                    loyaltyUser.level.color ? `bg-${loyaltyUser.level.color}-100` : 'bg-blue-100'
                  }`}>
                    <Crown className={`h-6 w-6 ${
                      loyaltyUser.level.color ? `text-${loyaltyUser.level.color}-600` : 'text-blue-600'
                    }`} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Poziom {loyaltyUser.level.name}
                    </h2>
                    <p className="text-gray-600">
                      {loyaltyUser.totalPoints} punktów łącznie
                    </p>
                  </div>
                </div>
                
                {loyaltyUser.nextLevel && (
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Do następnego poziomu</p>
                    <p className="text-lg font-semibold text-blue-600">
                      {loyaltyUser.nextLevel.pointsNeeded} punktów
                    </p>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              {loyaltyUser.nextLevel && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Postęp do {loyaltyUser.nextLevel.name}</span>
                    <span>
                      {loyaltyUser.totalPoints} / {loyaltyUser.totalPoints + loyaltyUser.nextLevel.pointsNeeded}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min(100, (loyaltyUser.totalPoints / (loyaltyUser.totalPoints + loyaltyUser.nextLevel.pointsNeeded)) * 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Benefits */}
              {loyaltyUser.level.benefits && (
                <LoyaltyBenefits level={loyaltyUser.level} benefits={loyaltyUser.level.benefits} />
              )}
            </div>

            {/* Points Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Coins className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Dostępne punkty</p>
                    <p className="text-2xl font-bold text-gray-900">{loyaltyUser.availablePoints}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Łączne punkty</p>
                    <p className="text-2xl font-bold text-gray-900">{loyaltyUser.totalPoints}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <ShoppingBag className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Wykorzystane</p>
                    <p className="text-2xl font-bold text-gray-900">{loyaltyUser.totalPoints - loyaltyUser.availablePoints}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Rewards */}
            <LoyaltyRewards 
              rewards={rewards}
              availablePoints={loyaltyUser.availablePoints}
              onRedeem={handleRedeem}
            />

            {/* Referral Program */}
            <ReferralProgram 
              userId={userId}
              referralCode={`REF${userId?.slice(-6)}`}
              referrerReward={100}
              refereeReward={50}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Szybkie akcje</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 transition-colors">
                  <Gift className="h-5 w-5 text-blue-600" />
                  <span>Wykorzystaj punkty</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 transition-colors">
                  <Target className="h-5 w-5 text-green-600" />
                  <span>Cele do osiągnięcia</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 transition-colors">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  <span>Bonusowe punkty</span>
                </button>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ostatnie transakcje</h3>
              <div className="space-y-3">
                {transactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <div className={`p-1 rounded-full ${
                        transaction.points > 0 ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {transaction.points > 0 ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {transaction.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(transaction.createdAt).toLocaleDateString('pl-PL')}
                        </p>
                      </div>
                    </div>
                    <div className={`text-sm font-medium ${
                      transaction.points > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.points > 0 ? '+' : ''}{transaction.points}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
