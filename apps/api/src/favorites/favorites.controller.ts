import { Controller, Get, Post, Delete, Body, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('favorites')
@ApiBearerAuth()
@Controller({ path: 'favorites', version: '1' })
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @Get()
  getMine(@CurrentUser() user: any) {
    return this.favoritesService.getMine(user.id);
  }

  @Post()
  add(@CurrentUser() user: any, @Body() dto: { targetType: string; targetId: string }) {
    return this.favoritesService.add(user.id, dto.targetType, dto.targetId);
  }

  @Delete()
  remove(@CurrentUser() user: any, @Query('targetType') targetType: string, @Query('targetId') targetId: string) {
    return this.favoritesService.remove(user.id, targetType, targetId);
  }
}
