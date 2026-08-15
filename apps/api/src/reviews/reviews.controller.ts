import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';

class CreateReviewDto {
  @IsString() orderId: string;
  @IsNumber() @Min(1) @Max(5) rating: number;
  @IsOptional() @IsString() comment?: string;
}

@ApiTags('reviews')
@ApiBearerAuth()
@Controller({ path: 'reviews', version: '1' })
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreateReviewDto) {
    return this.reviewsService.createReview(user.id, user.role, dto);
  }

  @Public()
  @Get('user/:userId')
  getForUser(@Param('userId') userId: string, @Query('page') page = 1, @Query('limit') limit = 10) {
    return this.reviewsService.getReviewsForUser(userId, +page, +limit);
  }

  @Public()
  @Get('listing/:listingId')
  getForListing(@Param('listingId') listingId: string, @Query('page') page = 1, @Query('limit') limit = 10) {
    return this.reviewsService.getReviewsForListing(listingId, +page, +limit);
  }
}
