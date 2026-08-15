import { Controller, Post, Get, Body, Param, Req, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { PaymentsService } from './payments.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { SkipThrottle } from '@nestjs/throttler';

class CreatePaymentOrderDto {
  @IsString() orderId: string;
}

class VerifyPaymentDto {
  @IsString() razorpayOrderId: string;
  @IsString() razorpayPaymentId: string;
  @IsString() razorpaySignature: string;
  @IsString() orderId: string;
}

@ApiTags('payments')
@ApiBearerAuth()
@Controller({ path: 'payments', version: '1' })
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('create-order')
  @ApiOperation({ summary: 'Create Razorpay payment order for an existing platform order' })
  createOrder(@CurrentUser() user: any, @Body() dto: CreatePaymentOrderDto) {
    return this.paymentsService.createPaymentOrder(dto.orderId, user.id);
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify payment signature (must be called after Razorpay checkout)' })
  verify(@CurrentUser() user: any, @Body() dto: VerifyPaymentDto) {
    return this.paymentsService.verifyPayment(
      dto.razorpayOrderId,
      dto.razorpayPaymentId,
      dto.razorpaySignature,
      dto.orderId,
      user.id,
    );
  }

  // Webhook — must be public but verified via Razorpay signature
  @Public()
  @SkipThrottle()
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Razorpay webhook endpoint (do not call manually)' })
  async webhook(@Req() req: any, @Headers('x-razorpay-signature') signature: string) {
    const rawBody = req.rawBody || '';
    return this.paymentsService.handleWebhook(rawBody, signature);
  }

  @Get(':orderId')
  @ApiOperation({ summary: 'Get payment status for an order' })
  getByOrder(@CurrentUser() user: any, @Param('orderId') orderId: string) {
    return this.paymentsService.getPaymentByOrder(orderId, user.id);
  }
}
