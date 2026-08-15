import {
  Injectable, NotFoundException, ForbiddenException, BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { ListingFiltersDto } from './dto/listing-filters.dto';
import { ListingStatus, UserRole } from '@prisma/client';
import { Prisma } from '@prisma/client';

@Injectable()
export class ListingsService {
  constructor(private prisma: PrismaService) {}

  async create(growerId: string, dto: CreateListingDto) {
    // Verify grower has a verified farm
    const farm = await this.prisma.farm.findUnique({
      where: { growerId, verificationStatus: 'VERIFIED' },
    });

    if (!farm) {
      throw new BadRequestException(
        'You need a verified farm profile to create listings. Please complete your farm profile and wait for verification.',
      );
    }

    const mushroomType = await this.prisma.mushroomType.findUnique({
      where: { id: dto.mushroomTypeId, isActive: true },
    });
    if (!mushroomType) throw new NotFoundException('Mushroom type not found');

    const listing = await this.prisma.listing.create({
      data: {
        growerId,
        farmId: farm.id,
        mushroomTypeId: dto.mushroomTypeId,
        title: dto.title,
        description: dto.description,
        images: dto.images || [],
        pricePerKg: dto.pricePerKg,
        currency: 'INR',
        availableQuantityKg: dto.availableQuantityKg,
        minOrderQuantityKg: dto.minOrderQuantityKg || 1,
        fulfillmentMethod: dto.fulfillmentMethod,
        availableFrom: dto.availableFrom ? new Date(dto.availableFrom) : new Date(),
        harvestDate: dto.harvestDate ? new Date(dto.harvestDate) : undefined,
        city: dto.city || farm.city,
        state: dto.state || farm.state,
        country: dto.country || farm.country,
        postalCode: dto.postalCode,
        latitude: dto.latitude,
        longitude: dto.longitude,
        status: dto.status || ListingStatus.ACTIVE,
        isB2b: dto.isB2b ?? true,
        isB2c: dto.isB2c ?? true,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : this.defaultExpiry(),
      },
      include: { mushroomType: true, farm: true },
    });

    // Log inventory stock in
    await this.prisma.inventoryTransaction.create({
      data: {
        listingId: listing.id,
        type: 'STOCK_IN',
        quantityKg: Number(listing.availableQuantityKg),
        previousQty: 0,
        newQty: Number(listing.availableQuantityKg),
        reason: 'Initial listing stock',
        createdBy: growerId,
      },
    });

    return listing;
  }

  async search(filters: ListingFiltersDto) {
    const { page = 1, limit = 20, q, mushroomTypeId, city, state, minPrice, maxPrice,
      minQuantity, fulfillmentMethod, verifiedOnly, isB2b, isB2c, sortBy = 'createdAt', sortOrder = 'desc' } = filters;

    const skip = (page - 1) * limit;

    const where: Prisma.ListingWhereInput = {
      status: ListingStatus.ACTIVE,
      deletedAt: null,
      availableFrom: { lte: new Date() },
      ...(mushroomTypeId && { mushroomTypeId }),
      ...(city && { city: { contains: city, mode: 'insensitive' } }),
      ...(state && { state: { contains: state, mode: 'insensitive' } }),
      ...(minPrice && { pricePerKg: { gte: minPrice } }),
      ...(maxPrice && { pricePerKg: { ...((minPrice && { gte: minPrice }) || {}), lte: maxPrice } }),
      ...(minQuantity && { availableQuantityKg: { gte: minQuantity } }),
      ...(fulfillmentMethod && { fulfillmentMethod }),
      ...(isB2b !== undefined && { isB2b }),
      ...(isB2c !== undefined && { isB2c }),
      ...(verifiedOnly && { farm: { verificationStatus: 'VERIFIED' } }),
    };

    // Full-text search
    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { mushroomType: { name: { contains: q, mode: 'insensitive' } } },
      ];
    }

    const validSortFields = ['createdAt', 'pricePerKg', 'availableQuantityKg', 'availableFrom'];
    const orderByField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';

    const [total, listings] = await Promise.all([
      this.prisma.listing.count({ where }),
      this.prisma.listing.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ isFeatured: 'desc' }, { [orderByField]: sortOrder }],
        include: {
          mushroomType: { select: { id: true, name: true, slug: true, imageUrl: true } },
          farm: {
            select: {
              id: true, name: true, slug: true, verificationStatus: true,
              averageRating: true, totalCompletedOrders: true, city: true, state: true,
            },
          },
          grower: {
            select: { profile: { select: { displayName: true, avatarUrl: true } } },
          },
        },
      }),
    ]);

    return {
      data: listings,
      meta: {
        page, limit, total,
        totalPages: Math.ceil(total / limit),
        hasNext: skip + limit < total,
        hasPrev: page > 1,
      },
    };
  }

  async findOne(id: string, userId?: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id, deletedAt: null },
      include: {
        mushroomType: true,
        farm: {
          include: {
            grower: {
              select: {
                id: true,
                profile: { select: { displayName: true, avatarUrl: true, bio: true } },
                _count: { select: { reviewsReceived: true } },
              },
            },
          },
        },
        reviews: {
          where: { isHidden: false },
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            reviewer: { select: { profile: { select: { displayName: true, avatarUrl: true } } } },
          },
        },
      },
    });

    if (!listing || listing.status === 'REMOVED') throw new NotFoundException('Listing not found');

    // Increment view count asynchronously
    this.prisma.listing.update({ where: { id }, data: { viewCount: { increment: 1 } } }).catch(() => {});

    return listing;
  }

  async getMyListings(growerId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where = { growerId, deletedAt: null };

    const [total, listings] = await Promise.all([
      this.prisma.listing.count({ where }),
      this.prisma.listing.findMany({
        where, skip, take: limit,
        orderBy: { createdAt: 'desc' },
        include: { mushroomType: true },
      }),
    ]);

    return { data: listings, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async update(growerId: string, listingId: string, dto: UpdateListingDto) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId, deletedAt: null },
    });

    if (!listing) throw new NotFoundException('Listing not found');
    if (listing.growerId !== growerId) throw new ForbiddenException('You can only edit your own listings');
    if (listing.status === 'REMOVED') throw new BadRequestException('Cannot edit a removed listing');

    return this.prisma.listing.update({
      where: { id: listingId },
      data: {
        ...dto,
        ...(dto.availableFrom && { availableFrom: new Date(dto.availableFrom) }),
        ...(dto.harvestDate && { harvestDate: new Date(dto.harvestDate) }),
      },
      include: { mushroomType: true },
    });
  }

  async remove(growerId: string, listingId: string, userRole: UserRole) {
    const listing = await this.prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) throw new NotFoundException('Listing not found');

    // Growers can only remove their own; admins can remove any
    if (userRole !== UserRole.ADMIN && listing.growerId !== growerId) {
      throw new ForbiddenException('You can only remove your own listings');
    }

    return this.prisma.listing.update({
      where: { id: listingId },
      data: { status: 'REMOVED', deletedAt: new Date() },
    });
  }

  private defaultExpiry(): Date {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d;
  }
}
