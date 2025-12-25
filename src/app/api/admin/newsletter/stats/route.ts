import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [
      totalSubscribers,
      activeSubscribers,
      unsubscribedCount,
      totalCampaigns,
      sentCampaigns,
      totalEmailsSent,
      campaignsWithStats
    ] = await Promise.all([
      prisma.newsletter.count(),
      prisma.newsletter.count({
        where: { isActive: true }
      }),
      prisma.newsletter.count({
        where: { isActive: false }
      }),
      prisma.newsletterCampaign.count(),
      prisma.newsletterCampaign.count({
        where: { status: 'SENT' }
      }),
      prisma.newsletterCampaign.aggregate({
        _sum: { sentCount: true }
      }),
      prisma.newsletterCampaign.findMany({
        where: {
          status: 'SENT',
          sentCount: { gt: 0 }
        },
        select: {
          openedCount: true,
          clickedCount: true,
          sentCount: true
        }
      })
    ])

    // Oblicz średnie wskaźniki
    const totalOpened = campaignsWithStats.reduce((sum, campaign) => sum + campaign.openedCount, 0)
    const totalClicked = campaignsWithStats.reduce((sum, campaign) => sum + campaign.clickedCount, 0)
    const totalSent = campaignsWithStats.reduce((sum, campaign) => sum + campaign.sentCount, 0)

    const averageOpenRate = totalSent > 0 ? (totalOpened / totalSent) * 100 : 0
    const averageClickRate = totalSent > 0 ? (totalClicked / totalSent) * 100 : 0

    return NextResponse.json({
      totalSubscribers,
      activeSubscribers,
      unsubscribedCount,
      totalCampaigns,
      sentCampaigns,
      totalEmailsSent: totalEmailsSent._sum.sentCount || 0,
      averageOpenRate,
      averageClickRate
    })

  } catch (error) {
    console.error('Error fetching newsletter stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
