// Requirements Service
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class RequirementsService {
  constructor(private prisma: PrismaService) {}

  async create(buyerId: string, dto: any) {
    return this.prisma.buyerRequirement.create({
      data: {
        buyerId,
        mushroomTypeId: dto.mushroomTypeId,
        title: dto.title,
        description: dto.description,
        quantityKg: dto.quantityKg,
        budgetMin: dto.budgetMin,
        budgetMax: dto.budgetMax,
        currency: 'INR',
        city: dto.city,
        state: dto.state,
        frequency: dto.frequency,
        frequencyNote: dto.frequencyNote,
        requiredFrom: new Date(dto.requiredFrom),
        requiredUntil: dto.requiredUntil ? new Date(dto.requiredUntil) : undefined,
        fulfillmentPreference: dto.fulfillmentPreference || 'BOTH',
        status: 'ACTIVE',
        expiresAt: this.defaultExpiry(),
      },
      include: { mushroomType: true, buyer: { select: { profile: true, business: true } } },
    });
  }

  async discover(filters: any) {
    const { page = 1, limit = 20, mushroomTypeId, city, state, frequency, q } = filters;
    const skip = (page - 1) * limit;
    const where: Prisma.BuyerRequirementWhereInput = {
      status: 'ACTIVE',
      deletedAt: null,
      ...(mushroomTypeId && { mushroomTypeId }),
      ...(city && { city: { contains: city, mode: 'insensitive' } }),
      ...(state && { state: { contains: state, mode: 'insensitive' } }),
      ...(frequency && { frequency }),
    };
    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }
    const [total, requirements] = await Promise.all([
      this.prisma.buyerRequirement.count({ where }),
      this.prisma.buyerRequirement.findMany({
        where, skip, take: limit, orderBy: { createdAt: 'desc' },
        include: {
          mushroomType: true,
          buyer: { select: { profile: { select: { displayName: true, avatarUrl: true } }, business: true } },
          _count: { select: { offers: true } },
        },
      }),
    ]);
    return { data: requirements, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const req = await this.prisma.buyerRequirement.findUnique({
      where: { id, deletedAt: null },
      include: {
        mushroomType: true,
        buyer: { select: { profile: true, business: true } },
        offers: { where: { status: { in: ['PENDING', 'ACCEPTED'] } }, take: 5 },
      },
    });
    if (!req) throw new NotFoundException('Requirement not found');
    return req;
  }

  async getMine(buyerId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where = { buyerId, deletedAt: null };
    const [total, requirements] = await Promise.all([
      this.prisma.buyerRequirement.count({ where }),
      this.prisma.buyerRequirement.findMany({
        where, skip, take: limit, orderBy: { createdAt: 'desc' },
        include: { mushroomType: true, _count: { select: { offers: true } } },
      }),
    ]);
    return { data: requirements, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async update(buyerId: string, id: string, dto: any) {
    const req = await this.prisma.buyerRequirement.findUnique({ where: { id } });
    if (!req) throw new NotFoundException('Requirement not found');
    if (req.buyerId !== buyerId) throw new ForbiddenException('Access denied');
    return this.prisma.buyerRequirement.update({ where: { id }, data: dto });
  }

  async cancel(buyerId: string, id: string) {
    const req = await this.prisma.buyerRequirement.findUnique({ where: { id } });
    if (!req) throw new NotFoundException('Requirement not found');
    if (req.buyerId !== buyerId) throw new ForbiddenException('Access denied');
    return this.prisma.buyerRequirement.update({ where: { id }, data: { status: 'CANCELLED', deletedAt: new Date() } });
  }

  private defaultExpiry(): Date {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d;
  }
}
