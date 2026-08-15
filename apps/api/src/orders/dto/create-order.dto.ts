import { IsString, IsNumber, IsOptional, IsEnum, IsDateString, Min } from 'class-validator';
import { FulfillmentMethod, OrderStatus } from '@prisma/client';

export class CreateOrderDto {
  @IsString() listingId: string;
  @IsOptional() @IsString() offerId?: string;
  @IsNumber() @Min(0.001) quantityKg: number;
  @IsOptional() @IsEnum(FulfillmentMethod) fulfillmentMethod?: FulfillmentMethod;
  @IsOptional() @IsString() deliveryAddressId?: string;
  @IsOptional() @IsDateString() scheduledDate?: string;
  @IsOptional() @IsString() notes?: string;
}

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus) status: OrderStatus;
  @IsOptional() @IsString() reason?: string;
}
