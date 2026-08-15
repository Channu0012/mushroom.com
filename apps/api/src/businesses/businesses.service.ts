import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BusinessesService {
  constructor(private prisma: PrismaService) {}

  async createBusiness(buyerId: string, dto: any) {
    const existing = await this.prisma.business.findUnique({ where: { buyerId } });
    if (existing) throw new ConflictException('You already have a business profile');
    return this.prisma.business.create({ data: { buyerId, ...dto } });
  }

  async getMyBusiness(buyerId: string) {
    const business = await this.prisma.business.findUnique({
      where: { buyerId },
      include: { verificationDocs: true },
    });
    if (!business) throw new NotFoundException('Business profile not found. Please create one first.');
    return business;
  }

  async updateBusiness(buyerId: string, dto: any) {
    const business = await this.prisma.business.findUnique({ where: { buyerId } });
    if (!business) throw new NotFoundException('Business not found');
    return this.prisma.business.update({ where: { buyerId }, data: dto });
  }
}
