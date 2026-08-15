import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OffersService {
  constructor(private prisma: PrismaService) {}

  async sendOffer(growerId: string, dto: any) {
    // Validate requirement exists and is active
    if (dto.requirementId) {
      const req = await this.prisma.buyerRequirement.findUnique({ where: { id: dto.requirementId } });
      if (!req || req.status !== 'ACTIVE') throw new NotFoundException('Requirement not found or not active');
      if (!dto.buyerId) dto.buyerId = req.buyerId;
    }

    // Validate listing if provided
    if (dto.listingId) {
      const listing = await this.prisma.listing.findUnique({ where: { id: dto.listingId } });
      if (!listing || listing.status !== 'ACTIVE') throw new NotFoundException('Listing not found or not active');
    }

    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours

    return this.prisma.offer.create({
      data: {
        ...dto,
        growerId,
        status: 'PENDING',
        expiresAt,
        deliveryDate: new Date(dto.deliveryDate),
      },
      include: {
        mushroomType: true,
        grower: { select: { profile: true, farm: true } },
        requirement: true,
        listing: true,
      },
    });
  }

  async respondToOffer(offerId: string, userId: string, action: 'accept' | 'reject' | 'counter', data?: any) {
    const offer = await this.prisma.offer.findUnique({ where: { id: offerId } });
    if (!offer) throw new NotFoundException('Offer not found');
    if (offer.buyerId !== userId) throw new ForbiddenException('This offer is not addressed to you');
    if (offer.status !== 'PENDING') throw new BadRequestException(`Offer is already ${offer.status}`);

    if (action === 'accept') {
      return this.prisma.offer.update({ where: { id: offerId }, data: { status: 'ACCEPTED' } });
    } else if (action === 'reject') {
      return this.prisma.offer.update({ where: { id: offerId }, data: { status: 'REJECTED' } });
    } else if (action === 'counter') {
      // Create a counter-offer
      await this.prisma.offer.update({ where: { id: offerId }, data: { status: 'COUNTERED' } });
      return this.prisma.offer.create({
        data: {
          requirementId: offer.requirementId,
          listingId: offer.listingId,
          mushroomTypeId: offer.mushroomTypeId,
          growerId: offer.growerId,
          buyerId: offer.buyerId,
          quantityKg: data?.quantityKg ?? offer.quantityKg,
          pricePerKg: data?.pricePerKg ?? offer.pricePerKg,
          deliveryDate: data?.deliveryDate ? new Date(data.deliveryDate) : offer.deliveryDate,
          message: data?.message,
          status: 'PENDING',
          parentOfferId: offerId,
          expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
        },
      });
    }
  }

  async getSentOffers(growerId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where = { growerId };
    const [total, offers] = await Promise.all([
      this.prisma.offer.count({ where }),
      this.prisma.offer.findMany({
        where, skip, take: limit, orderBy: { createdAt: 'desc' },
        include: { mushroomType: true, buyer: { select: { profile: true } }, requirement: true },
      }),
    ]);
    return { data: offers, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async getReceivedOffers(buyerId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where = { buyerId };
    const [total, offers] = await Promise.all([
      this.prisma.offer.count({ where }),
      this.prisma.offer.findMany({
        where, skip, take: limit, orderBy: { createdAt: 'desc' },
        include: { mushroomType: true, grower: { select: { profile: true, farm: true } }, listing: true },
      }),
    ]);
    return { data: offers, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }
}
