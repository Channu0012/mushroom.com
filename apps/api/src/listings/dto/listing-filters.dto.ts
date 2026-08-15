import { IsOptional, IsString, IsNumber, IsEnum, IsBoolean, Min, Max } from 'class-validator';
import { FulfillmentMethod } from '@prisma/client';

export class ListingFiltersDto {
  @IsOptional() @IsNumber() @Min(1) page?: number;
  @IsOptional() @IsNumber() @Min(1) @Max(100) limit?: number;
  @IsOptional() @IsString() q?: string;
  @IsOptional() @IsString() mushroomTypeId?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() state?: string;
  @IsOptional() @IsNumber() @Min(0) minPrice?: number;
  @IsOptional() @IsNumber() @Min(0) maxPrice?: number;
  @IsOptional() @IsNumber() @Min(0) minQuantity?: number;
  @IsOptional() @IsEnum(FulfillmentMethod) fulfillmentMethod?: FulfillmentMethod;
  @IsOptional() @IsBoolean() verifiedOnly?: boolean;
  @IsOptional() @IsBoolean() isB2b?: boolean;
  @IsOptional() @IsBoolean() isB2c?: boolean;
  @IsOptional() @IsString() sortBy?: string;
  @IsOptional() @IsString() sortOrder?: 'asc' | 'desc';
}
