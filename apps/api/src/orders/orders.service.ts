import {
  Injectable, NotFoundException, BadRequestException, ForbiddenException, ConflictException, Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus, UserRole } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

// Define valid state transitions (who can trigger which transitions)
const STATE_TRANSITIONS: Record<OrderStatus, { from: OrderStatus[]; allowedRoles: UserRole[] }> = {
  [OrderStatus.CONFIRMED]: {
    from: [OrderStatus.PENDING],
    allowedRoles: [UserRole.GROWER, UserRole.ADMIN],
  },
  [OrderStatus.PREPARING]: {
    from: [OrderStatus.CONFIRMED],
    allowedRoles: [UserRole.GROWER, UserRole.ADMIN],
  },
  [OrderStatus.READY]: {
    from: [OrderStatus.PREPARING],
    allowedRoles: [UserRole.GROWER, UserRole.ADMIN],
  },
  [OrderStatus.OUT_FOR_DELIVERY]: {
    from: [OrderStatus.READY],
    allowedRoles: [UserRole.GROWER, UserRole.ADMIN],
  },
  [OrderStatus.DELIVERED]: {
    from: [OrderStatus.OUT_FOR_DELIVERY, OrderStatus.READY],
    allowedRoles: [UserRole.GROWER, UserRole.ADMIN],
  },
  [OrderStatus.COMPLETED]: {
    from: [OrderStatus.DELIVERED],
    allowedRoles: [UserRole.B2B_BUYER, UserRole.CONSUMER, UserRole.ADMIN],
  },
  [OrderStatus.CANCELLED]: {
    from: [OrderStatus.PENDING, OrderStatus.CONFIRMED],
    allowedRoles: [UserRole.GROWER, UserRole.B2B_BUYER, UserRole.CONSUMER, UserRole.ADMIN],
  },
  [OrderStatus.DISPUTED]: {
    from: [OrderStatus.DELIVERED, OrderStatus.COMPLETED],
    allowedRoles: [UserRole.GROWER, UserRole.B2B_BUYER, UserRole.CONSUMER],
  },
  [OrderStatus.REFUNDED]: {
    from: [OrderStatus.CANCELLED, OrderStatus.DISPUTED],
    allowedRoles: [UserRole.ADMIN],
  },
  [OrderStatus.PENDING]: { from: [], allowedRoles: [] }, // initial state only
};

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(private prisma: PrismaService) {}

  async createOrder(buyerId: string, dto: CreateOrderDto) {
    // ── 1. Validate listing ─────────────────────────────────
    const listing = await this.prisma.listing.findUnique({
      where: { id: dto.listingId, status: 'ACTIVE', deletedAt: null },
      include: { grower: true, farm: true },
    });

    if (!listing) throw new NotFoundException('This listing is not available');
    if (listing.growerId === buyerId) throw new BadRequestException('You cannot order from yourself');
    if (listing.farm.verificationStatus !== 'VERIFIED') {
      throw new BadRequestException('This grower is not yet verified');
    }

    // ── 2. Validate offer if provided ───────────────────────
    if (dto.offerId) {
      const offer = await this.prisma.offer.findUnique({ where: { id: dto.offerId } });
      if (!offer || offer.status !== 'ACCEPTED') {
        throw new BadRequestException('Referenced offer is not in accepted state');
      }
      if (offer.buyerId !== buyerId) throw new ForbiddenException('This offer does not belong to you');
    }

    // ── 3. Fetch current commission rate from platform settings ──
    const commissionSetting = await this.prisma.platformSetting.findUnique({
      where: { key: 'commission.global_rate' },
    });
    const commissionRate = (commissionSetting?.value as any)?.rate ?? 0.03;

    // ── 4. Server-side price calculation (NEVER trust client amounts) ──
    const unitPrice = Number(listing.pricePerKg);
    const quantity = dto.quantityKg;
    const subtotal = Math.round(unitPrice * quantity * 100) / 100;
    const commissionAmount = Math.round(subtotal * commissionRate * 100) / 100;
    const taxes = 0; // Phase 2: GST calculation
    const totalAmount = Math.round((subtotal + taxes) * 100) / 100;

    // ── 5. Validate minimum order quantity ──────────────────
    if (quantity < Number(listing.minOrderQuantityKg)) {
      throw new BadRequestException(
        `Minimum order quantity is ${listing.minOrderQuantityKg} kg`,
      );
    }

    // ── 6. ATOMIC inventory check + deduction ──────────────
    // Uses a transaction with row-level lock to prevent overselling
    const order = await this.prisma.$transaction(async (tx) => {
      // Lock the listing row for this transaction
      const lockedListing = await tx.$queryRaw<any[]>`
        SELECT id, available_quantity_kg, status 
        FROM listings 
        WHERE id = ${listing.id} 
        FOR UPDATE
      `;

      if (!lockedListing.length || lockedListing[0].status !== 'ACTIVE') {
        throw new ConflictException('This listing is no longer available');
      }

      const currentQty = Number(lockedListing[0].available_quantity_kg);

      if (currentQty < quantity) {
        throw new ConflictException(
          `Insufficient quantity. Available: ${currentQty} kg, Requested: ${quantity} kg`,
        );
      }

      const newQty = Math.round((currentQty - quantity) * 1000) / 1000;

      // Deduct inventory
      await tx.listing.update({
        where: { id: listing.id },
        data: {
          availableQuantityKg: newQty,
          status: newQty === 0 ? 'SOLD_OUT' : 'ACTIVE',
        },
      });

      // Generate human-readable order number
      const orderNumber = `MM-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          buyerId,
          growerId: listing.growerId,
          listingId: listing.id,
          offerId: dto.offerId,
          quantityKg: quantity,
          unitPriceAtOrder: unitPrice,
          subtotal,
          platformCommissionRate: commissionRate,
          platformCommissionAmt: commissionAmount,
          taxes,
          totalAmount,
          currency: 'INR',
          fulfillmentMethod: dto.fulfillmentMethod || listing.fulfillmentMethod,
          deliveryAddressId: dto.deliveryAddressId,
          scheduledDate: dto.scheduledDate ? new Date(dto.scheduledDate) : undefined,
          notes: dto.notes,
          status: OrderStatus.PENDING,
        },
        include: {
          listing: { include: { mushroomType: true } },
          buyer: { select: { profile: true } },
          grower: { select: { profile: true } },
        },
      });

      // Log inventory transaction
      await tx.inventoryTransaction.create({
        data: {
          listingId: listing.id,
          orderId: newOrder.id,
          type: 'RESERVED',
          quantityKg: quantity,
          previousQty: currentQty,
          newQty,
          reason: `Order ${orderNumber}`,
          createdBy: buyerId,
        },
      });

      // Record status history
      await tx.orderStatusHistory.create({
        data: {
          orderId: newOrder.id,
          toStatus: OrderStatus.PENDING,
          changedBy: buyerId,
          reason: 'Order created',
        },
      });

      return newOrder;
    });

    this.logger.log(`Order created: ${order.orderNumber} | Buyer: ${buyerId} | Amount: ₹${totalAmount}`);

    return order;
  }

  async getOrders(userId: string, userRole: UserRole, page = 1, limit = 20, status?: OrderStatus) {
    const skip = (page - 1) * limit;
    let where: any = {};

    // Filter by role — buyers see their purchases, growers see their sales
    if (userRole === UserRole.B2B_BUYER || userRole === UserRole.CONSUMER) {
      where.buyerId = userId;
    } else if (userRole === UserRole.GROWER) {
      where.growerId = userId;
    } else if (userRole === UserRole.ADMIN) {
      // Admin sees all
    }

    if (status) where.status = status;

    const [total, orders] = await Promise.all([
      this.prisma.order.count({ where }),
      this.prisma.order.findMany({
        where, skip, take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          listing: { include: { mushroomType: true } },
          buyer: { select: { profile: { select: { displayName: true } } } },
          grower: { select: { profile: { select: { displayName: true } } } },
          payment: { select: { status: true, amount: true } },
        },
      }),
    ]);

    return { data: orders, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async getOrderById(orderId: string, userId: string, userRole: UserRole) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        listing: { include: { mushroomType: true, farm: true } },
        buyer: { select: { id: true, profile: true } },
        grower: { select: { id: true, profile: true, farm: true } },
        payment: true,
        payout: userRole === UserRole.GROWER || userRole === UserRole.ADMIN ? true : false,
        reviews: { include: { reviewer: { select: { profile: true } } } },
        dispute: true,
        statusHistory: { orderBy: { createdAt: 'asc' } },
        deliveryAddress: true,
      },
    });

    if (!order) throw new NotFoundException('Order not found');

    // Access control: only buyer, grower, or admin can view order
    const canAccess =
      order.buyerId === userId ||
      order.growerId === userId ||
      userRole === UserRole.ADMIN;

    if (!canAccess) throw new ForbiddenException('You do not have access to this order');

    return order;
  }

  async updateOrderStatus(
    orderId: string,
    newStatus: OrderStatus,
    userId: string,
    userRole: UserRole,
    reason?: string,
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { listing: true },
    });

    if (!order) throw new NotFoundException('Order not found');

    // Check access — only involved parties or admin
    const isInvolved = order.buyerId === userId || order.growerId === userId;
    if (!isInvolved && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('You do not have access to this order');
    }

    // Validate transition
    const transition = STATE_TRANSITIONS[newStatus];
    if (!transition) throw new BadRequestException(`Invalid order status: ${newStatus}`);

    if (!transition.from.includes(order.status as OrderStatus)) {
      throw new BadRequestException(
        `Cannot transition from ${order.status} to ${newStatus}. ` +
        `Valid transitions from ${order.status}: ${transition.from.join(', ')}`,
      );
    }

    if (!transition.allowedRoles.includes(userRole)) {
      throw new ForbiddenException(
        `Your role (${userRole}) cannot set orders to ${newStatus}`,
      );
    }

    // Handle cancellation: release inventory
    const updateData: any = {
      status: newStatus,
      ...(newStatus === OrderStatus.COMPLETED && { completedAt: new Date() }),
      ...(newStatus === OrderStatus.CANCELLED && {
        cancellationReason: reason,
        cancelledBy: userId,
      }),
    };

    const [updatedOrder] = await this.prisma.$transaction([
      this.prisma.order.update({
        where: { id: orderId },
        data: updateData,
        include: { listing: true, buyer: { select: { profile: true } }, grower: { select: { profile: true } } },
      }),
      this.prisma.orderStatusHistory.create({
        data: {
          orderId,
          fromStatus: order.status as OrderStatus,
          toStatus: newStatus,
          changedBy: userId,
          reason,
        },
      }),
    ]);

    // If cancelled, release reserved inventory
    if (newStatus === OrderStatus.CANCELLED) {
      await this.releaseInventory(order.listingId, Number(order.quantityKg), orderId, userId);

      // Update payout status if exists
      await this.prisma.payout.updateMany({
        where: { orderId },
        data: { status: 'ON_HOLD', notes: `Order cancelled: ${reason}` },
      });
    }

    // On completion, update farm stats
    if (newStatus === OrderStatus.COMPLETED) {
      await this.updateFarmStats(order.growerId);
    }

    this.logger.log(`Order ${order.orderNumber}: ${order.status} → ${newStatus} by ${userId}`);

    return updatedOrder;
  }

  private async releaseInventory(listingId: string, quantity: number, orderId: string, userId: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) return;

    const newQty = Number(listing.availableQuantityKg) + quantity;

    await this.prisma.$transaction([
      this.prisma.listing.update({
        where: { id: listingId },
        data: {
          availableQuantityKg: newQty,
          status: listing.status === 'SOLD_OUT' ? 'ACTIVE' : listing.status,
        },
      }),
      this.prisma.inventoryTransaction.create({
        data: {
          listingId,
          orderId,
          type: 'RELEASED',
          quantityKg: quantity,
          previousQty: Number(listing.availableQuantityKg),
          newQty,
          reason: 'Order cancelled — inventory released',
          createdBy: userId,
        },
      }),
    ]);
  }

  private async updateFarmStats(growerId: string) {
    const farm = await this.prisma.farm.findUnique({ where: { growerId } });
    if (!farm) return;

    const stats = await this.prisma.review.aggregate({
      where: { revieweeId: growerId, type: 'BUYER_TO_GROWER', isHidden: false },
      _avg: { rating: true },
      _count: { id: true },
    });

    await this.prisma.farm.update({
      where: { id: farm.id },
      data: {
        totalCompletedOrders: { increment: 1 },
        averageRating: stats._avg.rating ? stats._avg.rating : undefined,
        totalReviews: stats._count.id,
      },
    });
  }
}
