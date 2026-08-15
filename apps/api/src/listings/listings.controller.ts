import {
  Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { ListingFiltersDto } from './dto/listing-filters.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('listings')
@ApiBearerAuth()
@Controller({ path: 'listings', version: '1' })
export class ListingsController {
  constructor(private listingsService: ListingsService) {}

  @Post()
  @Roles(UserRole.GROWER)
  @ApiOperation({ summary: 'Create a new listing (growers only, requires verified farm)' })
  create(@CurrentUser() user: any, @Body() dto: CreateListingDto) {
    return this.listingsService.create(user.id, dto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Search & browse listings (public)' })
  search(@Query() filters: ListingFiltersDto) {
    return this.listingsService.search(filters);
  }

  @Get('mine')
  @Roles(UserRole.GROWER)
  @ApiOperation({ summary: 'Get my listings' })
  getMine(@CurrentUser() user: any, @Query('page') page = 1, @Query('limit') limit = 20) {
    return this.listingsService.getMyListings(user.id, +page, +limit);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get listing details (public)' })
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.listingsService.findOne(id, user?.id);
  }

  @Patch(':id')
  @Roles(UserRole.GROWER)
  @ApiOperation({ summary: 'Update a listing' })
  update(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: UpdateListingDto) {
    return this.listingsService.update(user.id, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove a listing' })
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.listingsService.remove(user.id, id, user.role);
  }
}
