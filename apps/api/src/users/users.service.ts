import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, deletedAt: null },
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        emailVerifiedAt: true,
        phoneVerifiedAt: true,
        lastLoginAt: true,
        createdAt: true,
        profile: true,
        farm: {
          select: {
            id: true, name: true, slug: true, verificationStatus: true,
            city: true, state: true, averageRating: true, totalCompletedOrders: true,
          },
        },
        business: {
          select: {
            id: true, businessName: true, businessType: true, verificationStatus: true,
          },
        },
        _count: {
          select: {
            buyerOrders: true,
            growerOrders: true,
            reviewsReceived: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getPublicProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, deletedAt: null, status: 'ACTIVE' },
      select: {
        id: true,
        role: true,
        createdAt: true,
        profile: {
          select: { displayName: true, avatarUrl: true, bio: true, city: true, state: true },
        },
        farm: {
          where: { isActive: true },
          select: {
            id: true, name: true, slug: true, coverImageUrl: true,
            city: true, state: true, verificationStatus: true,
            averageRating: true, totalCompletedOrders: true, totalReviews: true,
            mushroomVarieties: true,
          },
        },
        _count: { select: { reviewsReceived: true } },
      },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) throw new NotFoundException('User not found');

    const profile = await this.prisma.profile.upsert({
      where: { userId },
      create: {
        userId,
        displayName: dto.displayName || user.email,
        ...dto,
      },
      update: dto,
    });

    return profile;
  }

  async addAddress(userId: string, dto: any) {
    // If this is the first address, make it default
    const count = await this.prisma.address.count({ where: { userId } });
    if (count === 0) dto.isDefault = true;

    return this.prisma.address.create({ data: { userId, ...dto } });
  }

  async getAddresses(userId: string) {
    return this.prisma.address.findMany({ where: { userId }, orderBy: { isDefault: 'desc' } });
  }

  async deactivateAccount(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        status: 'DEACTIVATED',
        deletedAt: new Date(),
        email: `deleted_${Date.now()}_${userId}@deactivated.local`, // free up email
      },
    });

    // Revoke all tokens
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    return { message: 'Account deactivated successfully' };
  }
}
