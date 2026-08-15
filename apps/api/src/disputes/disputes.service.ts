import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DisputesService {
  constructor(private prisma: PrismaService) {}

  async raiseDispute(raisedById: string, dto: any) {
    const order = await this.prisma.order.findUnique({ where: { id: dto.orderId } });
    if (!order) throw new NotFoundException('Order not found');

    if (order.buyerId !== raisedById && order.growerId !== raisedById) {
      throw new ForbiddenException('You are not part of this order');
    }

    if (!['DELIVERED', 'COMPLETED', 'CONFIRMED'].includes(order.status)) {
      throw new BadRequestException('Disputes can only be raised on active or completed orders');
    }

    const existing = await this.prisma.dispute.findUnique({ where: { orderId: dto.orderId } });
    if (existing) throw new BadRequestException('A dispute already exists for this order');

    const againstId = order.buyerId === raisedById ? order.growerId : order.buyerId;

    const [dispute] = await this.prisma.$transaction([
      this.prisma.dispute.create({
        data: {
          orderId: dto.orderId, raisedById, againstId,
          type: dto.type, description: dto.description, evidence: dto.evidence || [],
          status: 'OPEN',
        },
        include: { order: true, raisedBy: { select: { profile: true } }, against: { select: { profile: true } } },
      }),
      this.prisma.order.update({ where: { id: dto.orderId }, data: { status: 'DISPUTED' } }),
    ]);

    return dispute;
  }

  async getMyDisputes(userId: string) {
    return this.prisma.dispute.findMany({
      where: { OR: [{ raisedById: userId }, { againstId: userId }] },
      include: { order: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getDispute(id: string, userId: string) {
    const dispute = await this.prisma.dispute.findUnique({
      where: { id },
      include: { order: { include: { listing: true } }, raisedBy: { select: { profile: true } }, against: { select: { profile: true } } },
    });
    if (!dispute) throw new NotFoundException('Dispute not found');
    if (dispute.raisedById !== userId && dispute.againstId !== userId) throw new ForbiddenException('Access denied');
    return dispute;
  }

  async addEvidence(id: string, userId: string, evidence: any[]) {
    const dispute = await this.prisma.dispute.findUnique({ where: { id } });
    if (!dispute) throw new NotFoundException('Dispute not found');
    if (dispute.raisedById !== userId && dispute.againstId !== userId) throw new ForbiddenException('Access denied');

    const existing = (dispute.evidence as any[]) || [];
    return this.prisma.dispute.update({ where: { id }, data: { evidence: [...existing, ...evidence] } });
  }
}
