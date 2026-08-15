import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async getMyNotifications(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [total, notifications, unreadCount] = await Promise.all([
      this.prisma.notification.count({ where: { userId } }),
      this.prisma.notification.findMany({
        where: { userId }, skip, take: limit, orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({ where: { userId, isRead: false } }),
    ]);
    return { data: notifications, meta: { page, limit, total, totalPages: Math.ceil(total / limit) }, unreadCount };
  }

  async markRead(notificationId: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async markAllRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async createNotification(data: {
    userId: string; type: string; title: string; body: string;
    data?: any; channel?: string; idempotencyKey: string;
  }) {
    return this.prisma.notification.upsert({
      where: { idempotencyKey: data.idempotencyKey },
      create: {
        userId: data.userId, type: data.type as any, title: data.title, body: data.body,
        data: data.data, channel: (data.channel || 'IN_APP') as any,
        idempotencyKey: data.idempotencyKey,
      },
      update: {},
    });
  }
}
