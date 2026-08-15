import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getMarketplaceMetrics() {
    const [
      totalOrders, completedOrders, activeGrowers, activeBuyers,
      activeListings, activeRequirements, pendingVerifications,
      openDisputes, gmvResult, platformRevenueResult,
    ] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.order.count({ where: { status: 'COMPLETED' } }),
      this.prisma.farm.count({ where: { verificationStatus: 'VERIFIED', isActive: true } }),
      this.prisma.business.count({ where: { verificationStatus: 'VERIFIED', isActive: true } }),
      this.prisma.listing.count({ where: { status: 'ACTIVE', deletedAt: null } }),
      this.prisma.buyerRequirement.count({ where: { status: 'ACTIVE', deletedAt: null } }),
      this.prisma.farm.count({ where: { verificationStatus: 'UNDER_REVIEW' } }),
      this.prisma.dispute.count({ where: { status: { in: ['OPEN', 'UNDER_REVIEW'] } } }),
      this.prisma.payment.aggregate({ where: { status: 'SUCCESS' }, _sum: { amount: true } }),
      this.prisma.payment.aggregate({ where: { status: 'SUCCESS' }, _sum: { amount: true } }),
    ]);

    const gmv = Number(gmvResult._sum.amount || 0);
    const commissionData = await this.prisma.order.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { platformCommissionAmt: true, totalAmount: true },
      _avg: { totalAmount: true },
    });

    return {
      gmv,
      totalOrders,
      completedOrders,
      activeGrowers,
      activeBuyers,
      activeListings,
      activeRequirements,
      pendingVerifications,
      openDisputes,
      platformRevenue: Number(commissionData._sum.platformCommissionAmt || 0),
      averageOrderValue: Number(commissionData._avg.totalAmount || 0),
      repeatOrderRate: 0, // Phase 2: calculate based on buyer repeat orders
    };
  }

  async getGrowerAnalytics(growerId: string) {
    const [orders, earnings, activeListings, reviews] = await Promise.all([
      this.prisma.order.groupBy({
        by: ['status'],
        where: { growerId },
        _count: { id: true },
        _sum: { totalAmount: true },
      }),
      this.prisma.payout.aggregate({
        where: { growerId },
        _sum: { netAmount: true },
      }),
      this.prisma.listing.count({ where: { growerId, status: 'ACTIVE', deletedAt: null } }),
      this.prisma.review.aggregate({
        where: { revieweeId: growerId, type: 'BUYER_TO_GROWER' },
        _avg: { rating: true },
        _count: { id: true },
      }),
    ]);

    return {
      orders: orders.map(o => ({ status: o.status, count: o._count.id, totalValue: o._sum.totalAmount })),
      totalEarnings: Number(earnings._sum.netAmount || 0),
      activeListings,
      averageRating: reviews._avg.rating,
      totalReviews: reviews._count.id,
    };
  }
}
