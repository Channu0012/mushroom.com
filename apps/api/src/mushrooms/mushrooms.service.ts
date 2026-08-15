import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MushroomsService {
  constructor(private prisma: PrismaService) {}

  async getCategories() {
    return this.prisma.mushroomCategory.findMany({
      where: { isActive: true },
      include: { mushroomTypes: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } } },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async getTypes(categoryId?: string) {
    return this.prisma.mushroomType.findMany({
      where: { isActive: true, ...(categoryId && { categoryId }) },
      include: { category: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async getTypeBySlug(slug: string) {
    return this.prisma.mushroomType.findUnique({
      where: { slug, isActive: true },
      include: { category: true },
    });
  }
}
