import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ],
      errorFormat: 'colorless',
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Database connected successfully');
    } catch (error) {
      this.logger.warn('Database server not reachable. Running API in resilient standalone mode.');
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Database disconnected');
  }

  /**
   * Clean database for testing purposes.
   * ONLY usable in test environment.
   */
  async cleanDatabase() {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('cleanDatabase() is only available in test environment');
    }
    // Delete in dependency order
    await this.$transaction([
      this.auditLog.deleteMany(),
      this.notification.deleteMany(),
      this.message.deleteMany(),
      this.conversationMember.deleteMany(),
      this.conversation.deleteMany(),
      this.dispute.deleteMany(),
      this.report.deleteMany(),
      this.review.deleteMany(),
      this.payout.deleteMany(),
      this.payment.deleteMany(),
      this.orderStatusHistory.deleteMany(),
      this.inventoryTransaction.deleteMany(),
      this.order.deleteMany(),
      this.offer.deleteMany(),
      this.favorite.deleteMany(),
      this.buyerRequirement.deleteMany(),
      this.listing.deleteMany(),
      this.verificationDocument.deleteMany(),
      this.adminRoleAssignment.deleteMany(),
      this.refreshToken.deleteMany(),
      this.address.deleteMany(),
      this.farm.deleteMany(),
      this.business.deleteMany(),
      this.profile.deleteMany(),
      this.user.deleteMany(),
      this.mushroomType.deleteMany(),
      this.mushroomCategory.deleteMany(),
      this.platformSetting.deleteMany(),
    ]);
  }
}
