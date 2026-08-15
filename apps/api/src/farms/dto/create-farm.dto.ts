import {
  IsString, IsOptional, IsNumber, IsArray, MaxLength, Min, Max,
} from 'class-validator';

export class CreateFarmDto {
  @IsString() @MaxLength(100) name: string;
  @IsOptional() @IsString() @MaxLength(2000) description?: string;
  @IsOptional() @IsString() coverImageUrl?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) images?: string[];
  @IsString() city: string;
  @IsString() state: string;
  @IsOptional() @IsString() country?: string;
  @IsOptional() @IsString() postalCode?: string;
  @IsOptional() @IsNumber() @Min(-90) @Max(90) latitude?: number;
  @IsOptional() @IsNumber() @Min(-180) @Max(180) longitude?: number;
  @IsOptional() @IsNumber() @Min(1900) @Max(2030) establishedYear?: number;
  @IsOptional() @IsNumber() @Min(0) farmSizeAcres?: number;
  @IsOptional() @IsArray() @IsString({ each: true }) mushroomVarieties?: string[];
}
