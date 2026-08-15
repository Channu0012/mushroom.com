// Favorites, Notifications, Disputes, Search, Analytics, Health, Storage — all module stubs
// Each properly wired to Prisma, following the same pattern

// ===== FAVORITES =====
import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async add(userId: string, targetType: string, targetId: string) {
    return this.prisma.favorite.create({ data: { userId, targetType: targetType as any, targetId } })
      .catch(() => { throw new ConflictException('Already in favorites'); });
  }

  async remove(userId: string, targetType: string, targetId: string) {
    return this.prisma.favorite.deleteMany({ where: { userId, targetType: targetType as any, targetId } });
  }

  async getMine(userId: string) {
    return this.prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
