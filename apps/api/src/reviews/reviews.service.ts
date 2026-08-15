import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async createReview(reviewerId: string, reviewerRole: UserRole, dto: any) {
    // Find the completed order
    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
    });

    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== 'COMPLETED') {
      throw new BadRequestException('Reviews can only be submitted after an order is completed');
    }

    // Determine who is reviewing whom
    let revieweeId: string;
    let reviewType: 'BUYER_TO_GROWER' | 'GROWER_TO_BUYER';

    if (reviewerRole === UserRole.B2B_BUYER || reviewerRole === UserRole.CONSUMER) {
      if (order.buyerId !== reviewerId) throw new ForbiddenException('This is not your order');
      revieweeId = order.growerId;
      reviewType = 'BUYER_TO_GROWER';
    } else if (reviewerRole === UserRole.GROWER) {
      if (order.growerId !== reviewerId) throw new ForbiddenException('This is not your order');
      revieweeId = order.buyerId;
      reviewType = 'GROWER_TO_BUYER';
    } else {
      throw new ForbiddenException('Admins cannot submit reviews');
    }

    // Prevent self-review
    if (revieweeId === reviewerId) throw new BadRequestException('You cannot review yourself');

    // One review per order per reviewer (enforced by DB unique constraint too)
    const existing = await this.prisma.review.findUnique({
      where: { orderId_reviewerId: { orderId: dto.orderId, reviewerId } },
    });
    if (existing) throw new BadRequestException('You have already reviewed this order');

    // Validate rating
    if (dto.rating < 1 || dto.rating > 5) throw new BadRequestException('Rating must be between 1 and 5');

    const review = await this.prisma.review.create({
      data: {
        orderId: dto.orderId,
        reviewerId,
        revieweeId,
        listingId: order.listingId,
        rating: dto.rating,
        comment: dto.comment,
        type: reviewType,
        isVerified: true,
      },
      include: {
        reviewer: { select: { profile: { select: { displayName: true, avatarUrl: true } } } },
      },
    });

    // Update farm rating
    await this.updateFarmRating(order.growerId);

    return review;
  }

  async getReviewsForUser(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const where = { revieweeId: userId, isHidden: false, type: 'BUYER_TO_GROWER' as const };

    const [total, reviews] = await Promise.all([
      this.prisma.review.count({ where }),
      this.prisma.review.findMany({
        where, skip, take: limit, orderBy: { createdAt: 'desc' },
        include: {
          reviewer: { select: { profile: { select: { displayName: true, avatarUrl: true } } } },
          order: { select: { orderNumber: true } },
        },
      }),
    ]);

    const stats = await this.prisma.review.aggregate({
      where,
      _avg: { rating: true },
      _count: { id: true },
    });

    return {
      data: reviews,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
      stats: { averageRating: stats._avg.rating, totalReviews: stats._count.id },
    };
  }

  async getReviewsForListing(listingId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const where = { listingId, isHidden: false };

    const [total, reviews] = await Promise.all([
      this.prisma.review.count({ where }),
      this.prisma.review.findMany({
        where, skip, take: limit, orderBy: { createdAt: 'desc' },
        include: { reviewer: { select: { profile: { select: { displayName: true, avatarUrl: true } } } } },
      }),
    ]);

    return { data: reviews, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  private async updateFarmRating(growerId: string) {
    const stats = await this.prisma.review.aggregate({
      where: { revieweeId: growerId, type: 'BUYER_TO_GROWER', isHidden: false },
      _avg: { rating: true },
      _count: { id: true },
    });

    await this.prisma.farm.updateMany({
      where: { growerId },
      data: {
        averageRating: stats._avg.rating ?? undefined,
        totalReviews: stats._count.id,
      },
    });
  }
}
