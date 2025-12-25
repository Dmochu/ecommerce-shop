import { prisma } from '@/lib/prisma'

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

export interface LoyaltyTransactionData {
  id: string
  type: string
  points: number
  description: string
  createdAt: Date
  orderId?: string
}

export class LoyaltyEngine {
  private static instance: LoyaltyEngine

  public static getInstance(): LoyaltyEngine {
    if (!LoyaltyEngine.instance) {
      LoyaltyEngine.instance = new LoyaltyEngine()
    }
    return LoyaltyEngine.instance
  }

  /**
   * Zarejestruj użytkownika w programie lojalnościowym
   */
  async enrollUser(userId: string, programId?: string): Promise<LoyaltyUserData | null> {
    try {
      // Znajdź aktywny program lojalnościowy
      let program
      if (programId) {
        program = await prisma.loyaltyProgram.findUnique({
          where: { id: programId, isActive: true }
        })
      } else {
        program = await prisma.loyaltyProgram.findFirst({
          where: { isActive: true },
          orderBy: { createdAt: 'asc' }
        })
      }

      if (!program) {
        throw new Error('No active loyalty program found')
      }

      // Sprawdź czy użytkownik już jest w programie
      const existingUser = await prisma.loyaltyUser.findUnique({
        where: { userId_programId: { userId, programId: program.id } }
      })

      if (existingUser) {
        return this.getUserData(existingUser.id)
      }

      // Znajdź najniższy poziom
      const lowestLevel = await prisma.loyaltyLevel.findFirst({
        where: { programId: program.id, isActive: true },
        orderBy: { minPoints: 'asc' }
      })

      if (!lowestLevel) {
        throw new Error('No loyalty levels found')
      }

      // Utwórz użytkownika w programie
      const loyaltyUser = await prisma.loyaltyUser.create({
        data: {
          userId,
          programId: program.id,
          levelId: lowestLevel.id
        }
      })

      return this.getUserData(loyaltyUser.id)
    } catch (error) {
      console.error('Error enrolling user in loyalty program:', error)
      return null
    }
  }

  /**
   * Pobierz dane użytkownika w programie lojalnościowym
   */
  async getUserData(loyaltyUserId: string): Promise<LoyaltyUserData | null> {
    try {
      const loyaltyUser = await prisma.loyaltyUser.findUnique({
        where: { id: loyaltyUserId },
        include: {
          level: true,
          program: true
        }
      })

      if (!loyaltyUser) return null

      // Znajdź następny poziom
      const nextLevel = await prisma.loyaltyLevel.findFirst({
        where: {
          programId: loyaltyUser.programId,
          minPoints: { gt: loyaltyUser.totalPoints },
          isActive: true
        },
        orderBy: { minPoints: 'asc' }
      })

      return {
        id: loyaltyUser.id,
        userId: loyaltyUser.userId,
        totalPoints: loyaltyUser.totalPoints,
        availablePoints: loyaltyUser.availablePoints,
        level: {
          id: loyaltyUser.level.id,
          name: loyaltyUser.level.name,
          color: loyaltyUser.level.color || undefined,
          icon: loyaltyUser.level.icon || undefined,
          benefits: loyaltyUser.level.benefits || undefined
        },
        nextLevel: nextLevel ? {
          name: nextLevel.name,
          pointsNeeded: nextLevel.minPoints - loyaltyUser.totalPoints
        } : undefined
      }
    } catch (error) {
      console.error('Error getting loyalty user data:', error)
      return null
    }
  }

  /**
   * Nalicz punkty za zamówienie
   */
  async awardPointsForOrder(orderId: string): Promise<boolean> {
    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          user: true,
          items: true
        }
      })

      if (!order || !order.user) return false

      // Znajdź użytkownika w programie lojalnościowym
      const loyaltyUser = await prisma.loyaltyUser.findFirst({
        where: { userId: order.user.id },
        include: { program: true }
      })

      if (!loyaltyUser) return false

      // Oblicz punkty do naliczenia
      const pointsToAward = this.calculatePointsForOrder(order, loyaltyUser.program)
      
      if (pointsToAward <= 0) return false

      // Nalicz punkty
      await prisma.loyaltyTransaction.create({
        data: {
          userId: order.user.id,
          loyaltyUserId: loyaltyUser.id,
          type: 'EARNED',
          points: pointsToAward,
          description: `Punkty za zamówienie #${order.id}`,
          orderId: order.id,
          expiresAt: loyaltyUser.program.expirationDays 
            ? new Date(Date.now() + loyaltyUser.program.expirationDays * 24 * 60 * 60 * 1000)
            : null
        }
      })

      // Aktualizuj statystyki użytkownika
      await this.updateUserStats(loyaltyUser.id, order.total, pointsToAward)

      // Sprawdź czy użytkownik awansował na wyższy poziom
      await this.checkLevelUp(loyaltyUser.id)

      return true
    } catch (error) {
      console.error('Error awarding points for order:', error)
      return false
    }
  }

  /**
   * Wykorzystaj punkty na rabat
   */
  async spendPoints(
    loyaltyUserId: string, 
    pointsToSpend: number, 
    orderId?: string
  ): Promise<{ success: boolean; discount: number; message?: string }> {
    try {
      const loyaltyUser = await prisma.loyaltyUser.findUnique({
        where: { id: loyaltyUserId },
        include: { program: true }
      })

      if (!loyaltyUser) {
        return { success: false, discount: 0, message: 'User not found in loyalty program' }
      }

      if (loyaltyUser.availablePoints < pointsToSpend) {
        return { success: false, discount: 0, message: 'Insufficient points' }
      }

      // Oblicz rabat (1 punkt = 0.01 zł)
      const discount = Math.min(pointsToSpend * 0.01, loyaltyUser.program.maxPointsPerOrder || Infinity)

      // Zarejestruj transakcję
      await prisma.loyaltyTransaction.create({
        data: {
          userId: loyaltyUser.userId,
          loyaltyUserId: loyaltyUser.id,
          type: 'SPENT',
          points: -pointsToSpend,
          description: `Wykorzystano ${pointsToSpend} punktów na rabat`,
          orderId: orderId || null
        }
      })

      // Aktualizuj statystyki użytkownika
      await prisma.loyaltyUser.update({
        where: { id: loyaltyUserId },
        data: {
          availablePoints: { decrement: pointsToSpend },
          usedPoints: { increment: pointsToSpend }
        }
      })

      return { success: true, discount }
    } catch (error) {
      console.error('Error spending loyalty points:', error)
      return { success: false, discount: 0, message: 'Error processing points' }
    }
  }

  /**
   * Pobierz historię transakcji użytkownika
   */
  async getUserTransactions(
    loyaltyUserId: string, 
    limit: number = 20
  ): Promise<LoyaltyTransactionData[]> {
    try {
      const transactions = await prisma.loyaltyTransaction.findMany({
        where: { loyaltyUserId },
        orderBy: { createdAt: 'desc' },
        take: limit
      })

      return transactions.map(t => ({
        id: t.id,
        type: t.type,
        points: t.points,
        description: t.description,
        createdAt: t.createdAt,
        orderId: t.orderId || undefined
      }))
    } catch (error) {
      console.error('Error getting user transactions:', error)
      return []
    }
  }

  /**
   * Oblicz punkty za zamówienie
   */
  private calculatePointsForOrder(order: any, program: any): number {
    let points = Math.floor(order.total * program.pointsPerZloty)

    // Sprawdź minimalną wartość zamówienia
    if (program.minOrderValue && order.total < program.minOrderValue) {
      return 0
    }

    // Sprawdź maksymalne punkty za zamówienie
    if (program.maxPointsPerOrder && points > program.maxPointsPerOrder) {
      points = program.maxPointsPerOrder
    }

    return points
  }

  /**
   * Aktualizuj statystyki użytkownika
   */
  private async updateUserStats(loyaltyUserId: string, orderTotal: number, pointsAwarded: number): Promise<void> {
    await prisma.loyaltyUser.update({
      where: { id: loyaltyUserId },
      data: {
        totalPoints: { increment: pointsAwarded },
        availablePoints: { increment: pointsAwarded },
        totalOrders: { increment: 1 },
        totalSpent: { increment: orderTotal },
        lastOrderAt: new Date(),
        lastActivityAt: new Date()
      }
    })
  }

  /**
   * Sprawdź czy użytkownik awansował na wyższy poziom
   */
  private async checkLevelUp(loyaltyUserId: string): Promise<void> {
    try {
      const loyaltyUser = await prisma.loyaltyUser.findUnique({
        where: { id: loyaltyUserId },
        include: { level: true }
      })

      if (!loyaltyUser) return

      // Znajdź wyższy poziom
      const nextLevel = await prisma.loyaltyLevel.findFirst({
        where: {
          programId: loyaltyUser.programId,
          minPoints: { lte: loyaltyUser.totalPoints },
          isActive: true,
          order: { gt: loyaltyUser.level.order }
        },
        orderBy: { order: 'desc' }
      })

      if (nextLevel && nextLevel.id !== loyaltyUser.levelId) {
        // Awansuj użytkownika
        await prisma.loyaltyUser.update({
          where: { id: loyaltyUserId },
          data: { levelId: nextLevel.id }
        })

        // Dodaj bonus za awans
        const bonusPoints = Math.floor(loyaltyUser.totalPoints * 0.1) // 10% bonus
        if (bonusPoints > 0) {
          await prisma.loyaltyTransaction.create({
            data: {
              userId: loyaltyUser.userId,
              loyaltyUserId: loyaltyUser.id,
              type: 'BONUS',
              points: bonusPoints,
              description: `Bonus za awans na poziom ${nextLevel.name}`
            }
          })

          await prisma.loyaltyUser.update({
            where: { id: loyaltyUserId },
            data: {
              totalPoints: { increment: bonusPoints },
              availablePoints: { increment: bonusPoints }
            }
          })
        }
      }
    } catch (error) {
      console.error('Error checking level up:', error)
    }
  }

  /**
   * Pobierz dostępne nagrody
   */
  async getAvailableRewards(loyaltyUserId: string): Promise<any[]> {
    try {
      const loyaltyUser = await prisma.loyaltyUser.findUnique({
        where: { id: loyaltyUserId }
      })

      if (!loyaltyUser) return []

      const rewards = await prisma.loyaltyReward.findMany({
        where: {
          isActive: true,
          pointsCost: { lte: loyaltyUser.availablePoints },
          OR: [
            { validFrom: null },
            { validFrom: { lte: new Date() } }
          ],
          OR: [
            { validUntil: null },
            { validUntil: { gte: new Date() } }
          ]
        },
        orderBy: { pointsCost: 'asc' }
      })

      return rewards
    } catch (error) {
      console.error('Error getting available rewards:', error)
      return []
    }
  }

  /**
   * Wykorzystaj nagrodę
   */
  async redeemReward(loyaltyUserId: string, rewardId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const reward = await prisma.loyaltyReward.findUnique({
        where: { id: rewardId }
      })

      if (!reward || !reward.isActive) {
        return { success: false, message: 'Reward not available' }
      }

      const loyaltyUser = await prisma.loyaltyUser.findUnique({
        where: { id: loyaltyUserId }
      })

      if (!loyaltyUser || loyaltyUser.availablePoints < reward.pointsCost) {
        return { success: false, message: 'Insufficient points' }
      }

      // Sprawdź limit użyć
      if (reward.isLimited && reward.usedCount >= (reward.usageLimit || 0)) {
        return { success: false, message: 'Reward limit reached' }
      }

      // Wykorzystaj nagrodę
      await prisma.loyaltyTransaction.create({
        data: {
          userId: loyaltyUser.userId,
          loyaltyUserId: loyaltyUser.id,
          type: 'SPENT',
          points: -reward.pointsCost,
          description: `Wykorzystano nagrodę: ${reward.name}`,
          rewardId: reward.id
        }
      })

      // Aktualizuj statystyki
      await prisma.loyaltyUser.update({
        where: { id: loyaltyUserId },
        data: {
          availablePoints: { decrement: reward.pointsCost },
          usedPoints: { increment: reward.pointsCost }
        }
      })

      await prisma.loyaltyReward.update({
        where: { id: rewardId },
        data: { usedCount: { increment: 1 } }
      })

      return { success: true, message: 'Reward redeemed successfully' }
    } catch (error) {
      console.error('Error redeeming reward:', error)
      return { success: false, message: 'Error redeeming reward' }
    }
  }
}

export const loyaltyEngine = LoyaltyEngine.getInstance()
