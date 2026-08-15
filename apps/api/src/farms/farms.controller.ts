import {
  Controller, Get, Post, Patch, Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { FarmsService } from './farms.service';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('farms')
@ApiBearerAuth()
@Controller({ path: 'farms', version: '1' })
export class FarmsController {
  constructor(private farmsService: FarmsService) {}

  @Post()
  @Roles(UserRole.GROWER)
  @ApiOperation({ summary: 'Create farm profile (growers only)' })
  create(@CurrentUser() user: any, @Body() dto: CreateFarmDto) {
    return this.farmsService.createFarm(user.id, dto);
  }

  @Get('mine')
  @Roles(UserRole.GROWER)
  @ApiOperation({ summary: 'Get my farm profile' })
  getMine(@CurrentUser() user: any) {
    return this.farmsService.getMyFarm(user.id);
  }

  @Patch('mine')
  @Roles(UserRole.GROWER)
  @ApiOperation({ summary: 'Update my farm profile' })
  update(@CurrentUser() user: any, @Body() dto: UpdateFarmDto) {
    return this.farmsService.updateFarm(user.id, dto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'List verified growers/farms (public)' })
  list(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('city') city?: string,
    @Query('state') state?: string,
  ) {
    return this.farmsService.listVerifiedFarms(+page, +limit, city, state);
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Get public farm profile by slug' })
  getBySlug(@Param('slug') slug: string) {
    return this.farmsService.getFarmBySlug(slug);
  }
}
