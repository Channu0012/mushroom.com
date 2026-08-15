import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async search(q: string, type?: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const results: any = {};

    if (!type || type === 'listing') {
      results.listings = await this.prisma.listing.findMany({
        where: {
          status: 'ACTIVE', deletedAt: null,
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
          ],
        },
        take: 10, skip,
        include: { mushroomType: true, farm: { select: { name: true, verificationStatus: true, city: true } } },
      });
    }

    if (!type || type === 'grower') {
      results.growers = await this.prisma.farm.findMany({
        where: {
          isActive: true, verificationStatus: 'VERIFIED',
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
          ],
        },
        take: 10, skip,
        include: { grower: { select: { profile: { select: { displayName: true, avatarUrl: true } } } } },
      });
    }

    if (!type || type === 'requirement') {
      results.requirements = await this.prisma.buyerRequirement.findMany({
        where: {
          status: 'ACTIVE', deletedAt: null,
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
          ],
        },
        take: 10, skip,
        include: { mushroomType: true },
      });
    }

    return results;
  }
}
