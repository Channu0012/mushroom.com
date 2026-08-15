import {
  Injectable, NotFoundException, ForbiddenException, BadRequestException, ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import slugify from 'slugify';

// slugify is a common util, using simple inline version:
function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

@Injectable()
export class FarmsService {
  constructor(private prisma: PrismaService) {}

  async createFarm(growerId: string, dto: CreateFarmDto) {
    // Check grower doesn't already have a farm
    const existing = await this.prisma.farm.findUnique({ where: { growerId } });
    if (existing) throw new ConflictException('You already have a farm profile');

    // Generate unique slug
    let slug = toSlug(dto.name);
    const slugCount = await this.prisma.farm.count({ where: { slug: { startsWith: slug } } });
    if (slugCount > 0) slug = `${slug}-${slugCount}`;

    return this.prisma.farm.create({
      data: { growerId, ...dto, slug },
    });
  }

  async getMyFarm(growerId: string) {
    const farm = await this.prisma.farm.findUnique({
      where: { growerId },
      include: {
        verificationDocs: true,
        listings: {
          where: { status: 'ACTIVE', deletedAt: null },
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!farm) throw new NotFoundException('Farm profile not found. Please create one first.');
    return farm;
  }

  async getFarmBySlug(slug: string) {
    const farm = await this.prisma.farm.findUnique({
      where: { slug, isActive: true },
      include: {
        grower: {
          select: {
            id: true,
            createdAt: true,
            profile: { select: { displayName: true, avatarUrl: true, bio: true } },
            _count: { select: { reviewsReceived: true } },
          },
        },
        listings: {
          where: { status: 'ACTIVE', deletedAt: null },
          include: { mushroomType: true },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });
    if (!farm) throw new NotFoundException('Farm not found');
    return farm;
  }

  async updateFarm(growerId: string, dto: UpdateFarmDto) {
    const farm = await this.prisma.farm.findUnique({ where: { growerId } });
    if (!farm) throw new NotFoundException('Farm not found');

    return this.prisma.farm.update({
      where: { growerId },
      data: dto,
    });
  }

  async getFarmById(farmId: string) {
    const farm = await this.prisma.farm.findUnique({
      where: { id: farmId, isActive: true },
      include: {
        grower: {
          select: {
            id: true,
            profile: { select: { displayName: true, avatarUrl: true } },
          },
        },
        listings: {
          where: { status: 'ACTIVE', deletedAt: null },
          include: { mushroomType: true },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });
    if (!farm) throw new NotFoundException('Farm not found');
    return farm;
  }

  async listVerifiedFarms(page = 1, limit = 20, city?: string, state?: string) {
    const skip = (page - 1) * limit;
    const where: any = {
      verificationStatus: 'VERIFIED',
      isActive: true,
    };
    if (city) where.city = { contains: city, mode: 'insensitive' };
    if (state) where.state = { contains: state, mode: 'insensitive' };

    const [total, farms] = await Promise.all([
      this.prisma.farm.count({ where }),
      this.prisma.farm.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ isFeatured: 'desc' }, { averageRating: 'desc' }],
        include: {
          grower: {
            select: { profile: { select: { displayName: true, avatarUrl: true } } },
          },
          _count: { select: { listings: true } },
        },
      }),
    ]);

    return {
      data: farms,
      meta: {
        page, limit, total,
        totalPages: Math.ceil(total / limit),
        hasNext: skip + limit < total,
        hasPrev: page > 1,
      },
    };
  }
}
