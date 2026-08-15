import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async createOrGetConversation(userId: string, otherUserId: string, context?: { listingId?: string; requirementId?: string; offerId?: string }) {
    // Check for existing conversation between these two users
    const existing = await this.prisma.conversation.findFirst({
      where: {
        AND: [
          { members: { some: { userId } } },
          { members: { some: { userId: otherUserId } } },
          ...(context?.listingId ? [{ listingId: context.listingId }] : []),
        ],
      },
      include: { members: true },
    });

    if (existing) return existing;

    // Create new conversation
    return this.prisma.conversation.create({
      data: {
        listingId: context?.listingId,
        requirementId: context?.requirementId,
        offerId: context?.offerId,
        members: {
          create: [{ userId }, { userId: otherUserId }],
        },
      },
      include: { members: { include: { user: { select: { profile: true } } } } },
    });
  }

  async getMyConversations(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const conversations = await this.prisma.conversation.findMany({
      where: { members: { some: { userId } } },
      skip, take: limit,
      orderBy: { updatedAt: 'desc' },
      include: {
        members: {
          include: { user: { select: { id: true, profile: { select: { displayName: true, avatarUrl: true } } } } },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
        _count: { select: { messages: true } },
      },
    });

    // Add unread count per conversation
    const withUnread = await Promise.all(
      conversations.map(async (conv) => {
        const member = conv.members.find((m) => m.userId === userId);
        const unreadCount = member?.lastReadAt
          ? await this.prisma.message.count({
              where: { conversationId: conv.id, createdAt: { gt: member.lastReadAt }, senderId: { not: userId } },
            })
          : 0;
        return { ...conv, unreadCount };
      }),
    );

    return withUnread;
  }

  async sendMessage(conversationId: string, senderId: string, content: string, attachments: any[] = []) {
    // Verify sender is a member
    const member = await this.prisma.conversationMember.findUnique({
      where: { conversationId_userId: { conversationId, userId: senderId } },
    });
    if (!member) throw new ForbiddenException('You are not a member of this conversation');

    const [message] = await this.prisma.$transaction([
      this.prisma.message.create({
        data: { conversationId, senderId, content, attachments },
        include: { sender: { select: { profile: { select: { displayName: true, avatarUrl: true } } } } },
      }),
      this.prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      }),
    ]);

    return message;
  }

  async getMessages(conversationId: string, userId: string, page = 1, limit = 50) {
    const member = await this.prisma.conversationMember.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
    });
    if (!member) throw new ForbiddenException('Access denied');

    const skip = (page - 1) * limit;
    const [total, messages] = await Promise.all([
      this.prisma.message.count({ where: { conversationId, isDeleted: false } }),
      this.prisma.message.findMany({
        where: { conversationId, isDeleted: false },
        skip, take: limit,
        orderBy: { createdAt: 'desc' }, // newest first, frontend reverses
        include: { sender: { select: { id: true, profile: { select: { displayName: true, avatarUrl: true } } } } },
      }),
    ]);

    // Update last read
    await this.prisma.conversationMember.update({
      where: { conversationId_userId: { conversationId, userId } },
      data: { lastReadAt: new Date() },
    });

    return { data: messages.reverse(), meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }
}
