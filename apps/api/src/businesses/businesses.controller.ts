import { Controller, Get, Post, Patch, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { BusinessesService } from './businesses.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('businesses')
@ApiBearerAuth()
@Controller({ path: 'businesses', version: '1' })
export class BusinessesController {
  constructor(private businessesService: BusinessesService) {}

  @Post()
  @Roles(UserRole.B2B_BUYER)
  create(@CurrentUser() user: any, @Body() dto: any) {
    return this.businessesService.createBusiness(user.id, dto);
  }

  @Get('mine')
  @Roles(UserRole.B2B_BUYER)
  getMine(@CurrentUser() user: any) {
    return this.businessesService.getMyBusiness(user.id);
  }

  @Patch('mine')
  @Roles(UserRole.B2B_BUYER)
  update(@CurrentUser() user: any, @Body() dto: any) {
    return this.businessesService.updateBusiness(user.id, dto);
  }
}
