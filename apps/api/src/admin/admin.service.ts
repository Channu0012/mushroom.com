import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VerificationStatus, UserStatus, AuditAction } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // ── VERIFICATION WORKFLOW ────────────────────────────────────
  async getPendingVerifications(type: 'farm' | 'business') {
    if (type === 'farm') {
      return this.prisma.farm.findMany({
        where: { verificationStatus: { in: ['PENDING', 'UNDER_REVIEW'] } },
        include: {
          grower: { select: { email: true, phone: true, profile: true } },
          verificationDocs: true,
        },
        orderBy: { createdAt: 'asc' },
      });
    }
    return this.prisma.business.findMany({
      where: { verificationStatus: { in: ['PENDING', 'UNDER_REVIEW'] } },
      include: {
        buyer: { select: { email: true, phone: true, profile: true } },
        verificationDocs: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async updateFarmVerification(
    farmId: string, status: VerificationStatus, adminId: string, notes?: string, rejectionReason?: string,
  ) {
    const farm = await this.prisma.farm.findUnique({ where: { id: farmId }, include: { grower: true } });
    if (!farm) throw new NotFoundException('Farm not found');

    const updated = await this.prisma.farm.update({
      where: { id: farmId },
      data: {
        verificationStatus: status,
        verifiedAt: status === 'VERIFIED' ? new Date() : undefined,
        verifiedBy: status === 'VERIFIED' ? adminId : undefined,
        description: notes || rejectionReason,
      },
    });

    // Log admin action
    await this.prisma.auditLog.create({
      data: {
        adminId,
        action: status === 'VERIFIED' ? AuditAction.USER_VERIFIED : AuditAction.USER_REJECTED,
        targetType: 'farm',
        targetId: farmId,
        reason: notes || rejectionReason,
        newState: { status },
      },
    });

    return updated;
  }

  // ── USER MANAGEMENT ──────────────────────────────────────────
  async getUsers(page = 1, limit = 20, search?: string, role?: string, status?: string) {
    const skip = (page - 1) * limit;
    const where: any = { deletedAt: null };
    if (role) where.role = role;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { profile: { displayName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [total, users] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where, skip, take: limit, orderBy: { createdAt: 'desc' },
        select: {
          id: true, email: true, phone: true, role: true, status: true,
          emailVerifiedAt: true, lastLoginAt: true, createdAt: true,
          profile: { select: { displayName: true } },
          farm: { select: { verificationStatus: true } },
          business: { select: { verificationStatus: true } },
          _count: { select: { buyerOrders: true, growerOrders: true } },
        },
      }),
    ]);

    return { data: users, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async updateUserStatus(userId: string, status: UserStatus, adminId: string, reason: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    if (user.role === 'ADMIN') throw new ForbiddenException('Cannot modify admin accounts via this endpoint');

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { status },
    });

    let action: AuditAction = AuditAction.USER_SUSPENDED;
    if (status === UserStatus.ACTIVE) action = AuditAction.USER_REACTIVATED;
    if (status === UserStatus.DEACTIVATED) action = AuditAction.USER_DEACTIVATED;

    await this.prisma.auditLog.create({
      data: {
        adminId,
        action,
        targetType: 'user',
        targetId: userId,
        reason,
        newState: { status },
      },
    });

    return updated;
  }

  // ── LISTINGS MANAGEMENT ──────────────────────────────────────
  async getListings(page = 1, limit = 20, status?: string) {
    const skip = (page - 1) * limit;
    const where: any = { deletedAt: null, ...(status && { status }) };

    const [total, listings] = await Promise.all([
      this.prisma.listing.count({ where }),
      this.prisma.listing.findMany({
        where, skip, take: limit, orderBy: { createdAt: 'desc' },
        include: { mushroomType: true, farm: true, grower: { select: { email: true, profile: true } } },
      }),
    ]);

    return { data: listings, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async featureListing(listingId: string, featured: boolean, adminId: string) {
    const updated = await this.prisma.listing.update({ where: { id: listingId }, data: { isFeatured: featured } });
    await this.prisma.auditLog.create({
      data: {
        adminId,
        action: AuditAction.LISTING_FEATURED,
        targetType: 'listing',
        targetId: listingId,
        newState: { isFeatured: featured },
      },
    });
    return updated;
  }

  // ── DISPUTES MANAGEMENT ──────────────────────────────────────
  async getDisputes(page = 1, limit = 20, status?: string) {
    const skip = (page - 1) * limit;
    const where: any = status ? { status } : {};

    const [total, disputes] = await Promise.all([
      this.prisma.dispute.count({ where }),
      this.prisma.dispute.findMany({
        where, skip, take: limit, orderBy: { createdAt: 'desc' },
        include: {
          order: { include: { listing: true } },
          raisedBy: { select: { email: true, profile: true } },
          against: { select: { email: true, profile: true } },
        },
      }),
    ]);

    return { data: disputes, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async resolveDispute(disputeId: string, decision: string, resolution: string, adminId: string, refundAmount?: number) {
    const dispute = await this.prisma.dispute.findUnique({ where: { id: disputeId }, include: { order: true } });
    if (!dispute) throw new NotFoundException('Dispute not found');

    const updated = await this.prisma.dispute.update({
      where: { id: disputeId },
      data: {
        status: 'RESOLVED',
        resolution,
        resolvedAt: new Date(),
        resolvedBy: adminId,
      },
    });

    if (decision === 'REFUND') {
      await this.prisma.order.update({ where: { id: dispute.orderId }, data: { status: 'REFUNDED' } });
    } else {
      await this.prisma.order.update({ where: { id: dispute.orderId }, data: { status: 'COMPLETED' } });
    }

    await this.prisma.auditLog.create({
      data: {
        adminId,
        action: AuditAction.DISPUTE_RESOLVED,
        targetType: 'dispute',
        targetId: disputeId,
        reason: resolution,
        newState: { decision, refundAmount },
      },
    });

    return updated;
  }

  // ── PAYOUTS MANAGEMENT ───────────────────────────────────────
  async getPendingPayouts(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where = { status: 'PENDING' as const };

    const [total, payouts] = await Promise.all([
      this.prisma.payout.count({ where }),
      this.prisma.payout.findMany({
        where, skip, take: limit, orderBy: { createdAt: 'asc' },
        include: {
          grower: { select: { email: true, profile: true } },
          order: { select: { orderNumber: true } },
        },
      }),
    ]);

    return { data: payouts, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async processPayout(payoutId: string, adminId: string, transactionRef: string) {
    const payout = await this.prisma.payout.findUnique({ where: { id: payoutId } });
    if (!payout) throw new NotFoundException('Payout not found');
    if (payout.status !== 'PENDING') throw new BadRequestException('Payout already processed');

    const updated = await this.prisma.payout.update({
      where: { id: payoutId },
      data: {
        status: 'PAID',
        processedAt: new Date(),
        providerTransferId: transactionRef,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        adminId,
        action: AuditAction.PAYOUT_PROCESSED,
        targetType: 'payout',
        targetId: payoutId,
        newState: { transactionRef },
      },
    });

    return updated;
  }

  // ── PLATFORM SETTINGS ────────────────────────────────────────
  async getSettings() {
    return this.prisma.platformSetting.findMany({ orderBy: { key: 'asc' } });
  }

  async updateSetting(key: string, value: any, adminId: string) {
    const updated = await this.prisma.platformSetting.upsert({
      where: { key },
      create: { key, value },
      update: { value, updatedAt: new Date() },
    });

    await this.prisma.auditLog.create({
      data: {
        adminId,
        action: AuditAction.PLATFORM_SETTING_CHANGED,
        targetType: 'setting',
        targetId: key,
        newState: { value },
      },
    });

    return updated;
  }
}
