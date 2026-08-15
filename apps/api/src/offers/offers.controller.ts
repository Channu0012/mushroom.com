import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { OffersService } from './offers.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('offers')
@ApiBearerAuth()
@Controller({ path: 'offers', version: '1' })
export class OffersController {
  constructor(private offersService: OffersService) {}

  @Post()
  @Roles(UserRole.GROWER)
  send(@CurrentUser() user: any, @Body() dto: any) {
    return this.offersService.sendOffer(user.id, dto);
  }

  @Get('sent')
  @Roles(UserRole.GROWER)
  getSent(@CurrentUser() user: any, @Query('page') page = 1, @Query('limit') limit = 20) {
    return this.offersService.getSentOffers(user.id, +page, +limit);
  }

  @Get('received')
  getReceived(@CurrentUser() user: any, @Query('page') page = 1, @Query('limit') limit = 20) {
    return this.offersService.getReceivedOffers(user.id, +page, +limit);
  }

  @Patch(':id/accept')
  accept(@CurrentUser() user: any, @Param('id') id: string) {
    return this.offersService.respondToOffer(id, user.id, 'accept');
  }

  @Patch(':id/reject')
  reject(@CurrentUser() user: any, @Param('id') id: string) {
    return this.offersService.respondToOffer(id, user.id, 'reject');
  }

  @Patch(':id/counter')
  counter(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: any) {
    return this.offersService.respondToOffer(id, user.id, 'counter', dto);
  }
}
