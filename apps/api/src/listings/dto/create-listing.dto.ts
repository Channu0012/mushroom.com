import {
  IsString, IsNumber, IsOptional, IsEnum, IsBoolean, IsArray, IsDateString, Min, Max, MaxLength,
} from 'class-validator';
import { FulfillmentMethod, ListingStatus } from '@prisma/client';

export class CreateListingDto {
  @IsString() mushroomTypeId: string;
  @IsString() @MaxLength(200) title: string;
  @IsOptional() @IsString() @MaxLength(2000) description?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) images?: string[];
  @IsNumber() @Min(1) @Max(100000) pricePerKg: number;
  @IsNumber() @Min(0.001) availableQuantityKg: number;
  @IsOptional() @IsNumber() @Min(0.001) minOrderQuantityKg?: number;
  @IsEnum(FulfillmentMethod) fulfillmentMethod: FulfillmentMethod;
  @IsOptional() @IsDateString() availableFrom?: string;
  @IsOptional() @IsDateString() harvestDate?: string;
  @IsOptional() @IsDateString() expiresAt?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() state?: string;
  @IsOptional() @IsString() country?: string;
  @IsOptional() @IsString() postalCode?: string;
  @IsOptional() @IsNumber() @Min(-90) @Max(90) latitude?: number;
  @IsOptional() @IsNumber() @Min(-180) @Max(180) longitude?: number;
  @IsOptional() @IsBoolean() isB2b?: boolean;
  @IsOptional() @IsBoolean() isB2c?: boolean;
  @IsOptional() @IsEnum(ListingStatus) status?: ListingStatus;
}
