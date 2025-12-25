'use client'

import { useState, useEffect, useCallback } from 'react'

export interface LoyaltyUserData {
  id: string
  userId: string
  totalPoints: number
  availablePoints: number
  level: {
    id: string
    name: string
    color?: string
    icon?: string
    benefits?: any
  }
  nextLevel?: {
    name: string
    pointsNeeded: number
  }
}

export interface LoyaltyTransaction {
  id: string
  type: string
  points: number
  description: string
  createdAt: Date
  orderId?: string
}

export interface LoyaltyReward {
  id: string
  name: string
  description?: string
  type: string
  value: number
  pointsCost: number
}

export function useLoyalty(userId?: string) {
  const [loyaltyUser, setLoyaltyUser] = useState<LoyaltyUserData | null>(null)
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([])
  const [rewards, setRewards] = useState<LoyaltyReward[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchLoyaltyData = useCallback(async () => {
    if (!userId) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/loyalty/user/${userId}`)
      const data = await response.json()

      if (response.ok) {
        setLoyaltyUser(data.loyaltyUser)
        setTransactions(data.transactions || [])
        setRewards(data.availableRewards || [])
      } else {
        setError(data.error || 'Failed to fetch loyalty data')
      }
    } catch (err) {
      setError('Failed to fetch loyalty data')
      console.error('Error fetching loyalty data:', err)
    } finally {
      setLoading(false)
    }
  }, [userId])

  const enrollInProgram = useCallback(async (programId?: string) => {
    if (!userId) return false

    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/loyalty/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, programId })
      })

      const data = await response.json()

      if (response.ok) {
        setLoyaltyUser(data.loyaltyUser)
        return true
      } else {
        setError(data.error || 'Failed to enroll in loyalty program')
        return false
      }
    } catch (err) {
      setError('Failed to enroll in loyalty program')
      console.error('Error enrolling in loyalty program:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [userId])

  const spendPoints = useCallback(async (pointsToSpend: number, orderId?: string) => {
    if (!loyaltyUser) return { success: false, discount: 0, message: 'Not enrolled in loyalty program' }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/loyalty/spend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loyaltyUserId: loyaltyUser.id,
          pointsToSpend,
          orderId
        })
      })

      const data = await response.json()

      if (data.success) {
        // Aktualizuj lokalny stan
        setLoyaltyUser(prev => prev ? {
          ...prev,
          availablePoints: prev.availablePoints - pointsToSpend
        } : null)
      }

      return data
    } catch (err) {
      setError('Failed to spend points')
      console.error('Error spending points:', err)
      return { success: false, discount: 0, message: 'Error spending points' }
    } finally {
      setLoading(false)
    }
  }, [loyaltyUser])

  const redeemReward = useCallback(async (rewardId: string) => {
    if (!loyaltyUser) return { success: false, message: 'Not enrolled in loyalty program' }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/loyalty/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loyaltyUserId: loyaltyUser.id,
          rewardId
        })
      })

      const data = await response.json()

      if (data.success) {
        // Odśwież dane
        await fetchLoyaltyData()
      }

      return data
    } catch (err) {
      setError('Failed to redeem reward')
      console.error('Error redeeming reward:', err)
      return { success: false, message: 'Error redeeming reward' }
    } finally {
      setLoading(false)
    }
  }, [loyaltyUser, fetchLoyaltyData])

  useEffect(() => {
    fetchLoyaltyData()
  }, [fetchLoyaltyData])

  return {
    loyaltyUser,
    transactions,
    rewards,
    loading,
    error,
    fetchLoyaltyData,
    enrollInProgram,
    spendPoints,
    redeemReward
  }
}

// Hook do automatycznego naliczania punktów za zamówienie
export function useLoyaltyPoints() {
  const awardPointsForOrder = useCallback(async (orderId: string) => {
    try {
      const response = await fetch('/api/loyalty/award', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      })

      return response.ok
    } catch (error) {
      console.error('Error awarding loyalty points:', error)
      return false
    }
  }, [])

  return { awardPointsForOrder }
}
