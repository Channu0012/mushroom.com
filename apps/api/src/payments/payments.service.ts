import {
  Injectable, BadRequestException, NotFoundException, Logger, ConflictException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'crypto';
import Razorpay from 'razorpay';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private razorpay: Razorpay;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    const keyId = config.get<string>('RAZORPAY_KEY_ID');
    const keySecret = config.get<string>('RAZORPAY_KEY_SECRET');

    if (!keyId || !keySecret || keyId.includes('REPLACE_WITH')) {
      this.logger.warn(
        '⚠️  Razorpay credentials not configured. Payment endpoints will be in stub mode.',
      );
    } else {
      this.razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    }
  }

  // ── CREATE RAZORPAY ORDER ────────────────────────────────────
  async createPaymentOrder(orderId: string, buyerId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });

    if (!order) throw new NotFoundException('Order not found');
    if (order.buyerId !== buyerId) throw new BadRequestException('Access denied');
    if (order.status !== 'PENDING') {
      throw new BadRequestException(`Cannot initiate payment for order in status: ${order.status}`);
    }
    if (order.payment?.status === 'SUCCESS') {
      throw new ConflictException('This order has already been paid');
    }

    const amountInPaise = Math.round(Number(order.totalAmount) * 100);

    if (!this.razorpay) {
      // Development stub — returns mock Razorpay order
      this.logger.warn('Razorpay not configured — returning stub payment order');
      return {
        razorpayOrderId: `rzp_stub_${Date.now()}`,
        amount: amountInPaise,
        currency: 'INR',
        keyId: 'rzp_test_stub',
        orderId: order.id,
        orderNumber: order.orderNumber,
        isStub: true,
      };
    }

    // Create Razorpay order server-side
    const rzpOrder = await this.razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: order.orderNumber,
      notes: {
        orderId: order.id,
        buyerId,
      },
    });

    // Create or update payment record
    await this.prisma.payment.upsert({
      where: { orderId },
      create: {
        orderId,
        payerId: buyerId,
        provider: 'RAZORPAY',
        providerOrderId: rzpOrder.id,
        amount: Number(order.totalAmount),
        currency: 'INR',
        status: 'INITIATED',
      },
      update: {
        providerOrderId: rzpOrder.id,
        status: 'INITIATED',
        initiatedAt: new Date(),
      },
    });

    this.logger.log(`Payment order created: ${rzpOrder.id} for order ${order.orderNumber}`);

    return {
      razorpayOrderId: rzpOrder.id,
      amount: amountInPaise,
      currency: 'INR',
      keyId: this.config.get<string>('RAZORPAY_KEY_ID'),
      orderId: order.id,
      orderNumber: order.orderNumber,
    };
  }

  // ── VERIFY PAYMENT (called after frontend payment) ───────────
  async verifyPayment(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
    orderId: string,
    buyerId: string,
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });

    if (!order) throw new NotFoundException('Order not found');
    if (order.buyerId !== buyerId) throw new BadRequestException('Access denied');

    // Idempotency check
    if (order.payment?.status === 'SUCCESS') {
      return { message: 'Payment already confirmed', orderId, status: 'SUCCESS' };
    }

    // ── CRITICAL: Verify signature server-side ──────────────
    const keySecret = this.config.get<string>('RAZORPAY_KEY_SECRET', '');
    const expectedSignature = createHmac('sha256', keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      this.logger.error(
        `Payment signature verification FAILED for order ${orderId}. ` +
        `Expected: ${expectedSignature}, Got: ${razorpaySignature}`,
      );
      throw new BadRequestException('Payment verification failed. Please contact support.');
    }

    // ── Update payment + order in transaction ───────────────
    await this.prisma.$transaction([
      this.prisma.payment.update({
        where: { orderId },
        data: {
          providerPaymentId: razorpayPaymentId,
          providerSignature: razorpaySignature,
          status: 'SUCCESS',
          completedAt: new Date(),
        },
      }),
      this.prisma.order.update({
        where: { id: orderId },
        data: { status: 'CONFIRMED' },
      }),
      this.prisma.orderStatusHistory.create({
        data: {
          orderId,
          fromStatus: 'PENDING',
          toStatus: 'CONFIRMED',
          reason: `Payment confirmed: ${razorpayPaymentId}`,
        },
      }),
    ]);

    // Create payout record (pending — will be processed after fulfillment)
    const payment = await this.prisma.payment.findUnique({ where: { orderId } });
    if (payment) {
      const grossAmount = Number(order.totalAmount);
      const commissionAmount = Number(order.platformCommissionAmt);
      const netAmount = Math.round((grossAmount - commissionAmount) * 100) / 100;

      await this.prisma.payout.upsert({
        where: { orderId },
        create: {
          growerId: order.growerId,
          orderId,
          paymentId: payment.id,
          grossAmount,
          commissionAmount,
          netAmount,
          status: 'PENDING',
        },
        update: {},
      });
    }

    // Log inventory as SOLD (was RESERVED)
    await this.prisma.inventoryTransaction.create({
      data: {
        listingId: order.listingId,
        orderId,
        type: 'SOLD',
        quantityKg: Number(order.quantityKg),
        previousQty: 0, // will be computed from listing
        newQty: 0,
        reason: `Payment confirmed: ${razorpayPaymentId}`,
        createdBy: buyerId,
      },
    });

    this.logger.log(`Payment verified: ${razorpayPaymentId} for order ${order.orderNumber}`);

    return {
      message: 'Payment confirmed successfully',
      orderId,
      orderNumber: order.orderNumber,
      status: 'SUCCESS',
    };
  }

  // ── RAZORPAY WEBHOOK ─────────────────────────────────────────
  async handleWebhook(rawBody: string, signature: string) {
    const webhookSecret = this.config.get<string>('RAZORPAY_WEBHOOK_SECRET', '');

    // Verify webhook signature
    if (webhookSecret && !webhookSecret.includes('REPLACE_WITH')) {
      const expectedSignature = createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      if (expectedSignature !== signature) {
        this.logger.error('Razorpay webhook signature verification FAILED');
        throw new BadRequestException('Invalid webhook signature');
      }
    }

    const event = JSON.parse(rawBody);
    const eventId = event.id;

    this.logger.log(`Razorpay webhook received: ${event.event} | ID: ${eventId}`);

    // Idempotency: check if we've processed this event
    const rzpOrderId = event.payload?.payment?.entity?.order_id;
    if (!rzpOrderId) return { received: true };

    const existingPayment = await this.prisma.payment.findUnique({
      where: { providerOrderId: rzpOrderId },
    });

    if (!existingPayment) {
      this.logger.warn(`Webhook for unknown Razorpay order: ${rzpOrderId}`);
      return { received: true };
    }

    // Check if already processed this event
    const processedEvents = (existingPayment.webhookEvents as string[]) || [];
    if (processedEvents.includes(eventId)) {
      this.logger.log(`Webhook event ${eventId} already processed — skipping`);
      return { received: true };
    }

    // Process event
    switch (event.event) {
      case 'payment.captured': {
        // Only update if not already SUCCESS (handles race with /verify endpoint)
        if (existingPayment.status !== 'SUCCESS') {
          const paymentEntity = event.payload.payment.entity;
          await this.prisma.payment.update({
            where: { id: existingPayment.id },
            data: {
              providerPaymentId: paymentEntity.id,
              status: 'SUCCESS',
              completedAt: new Date(),
              webhookEvents: [...processedEvents, eventId],
            },
          });

          // Confirm order
          const order = await this.prisma.order.findUnique({
            where: { id: existingPayment.orderId },
          });
          if (order && order.status === 'PENDING') {
            await this.prisma.order.update({
              where: { id: order.id },
              data: { status: 'CONFIRMED' },
            });
          }
        } else {
          // Still mark event as processed
          await this.prisma.payment.update({
            where: { id: existingPayment.id },
            data: { webhookEvents: [...processedEvents, eventId] },
          });
        }
        break;
      }

      case 'payment.failed': {
        await this.prisma.payment.update({
          where: { id: existingPayment.id },
          data: {
            status: 'FAILED',
            failedAt: new Date(),
            failureReason: event.payload?.payment?.entity?.error_description,
            webhookEvents: [...processedEvents, eventId],
          },
        });
        break;
      }

      case 'refund.processed': {
        const refundEntity = event.payload?.refund?.entity;
        await this.prisma.payment.update({
          where: { id: existingPayment.id },
          data: {
            status: 'REFUNDED',
            refundAmount: refundEntity?.amount ? refundEntity.amount / 100 : undefined,
            refundedAt: new Date(),
            webhookEvents: [...processedEvents, eventId],
          },
        });
        break;
      }

      default:
        // Acknowledge unknown events
        await this.prisma.payment.update({
          where: { id: existingPayment.id },
          data: { webhookEvents: [...processedEvents, eventId] },
        });
    }

    return { received: true };
  }

  async getPaymentByOrder(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');
    if (order.buyerId !== userId && order.growerId !== userId) {
      throw new BadRequestException('Access denied');
    }

    const payment = await this.prisma.payment.findUnique({ where: { orderId } });
    if (!payment) throw new NotFoundException('No payment record found for this order');

    // Mask sensitive fields
    return {
      id: payment.id,
      orderId: payment.orderId,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      initiatedAt: payment.initiatedAt,
      completedAt: payment.completedAt,
      refundAmount: payment.refundAmount,
      refundedAt: payment.refundedAt,
    };
  }
}
