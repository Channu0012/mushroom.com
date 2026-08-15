import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { MushroomsService } from './mushrooms.service';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('mushrooms')
@Public()
@Controller({ path: 'mushrooms', version: '1' })
export class MushroomsController {
  constructor(private mushroomsService: MushroomsService) {}

  @Get('categories')
  @ApiOperation({ summary: 'Get all mushroom categories with types' })
  getCategories() { return this.mushroomsService.getCategories(); }

  @Get('types')
  @ApiOperation({ summary: 'Get all mushroom types' })
  getTypes(@Query('categoryId') categoryId?: string) {
    return this.mushroomsService.getTypes(categoryId);
  }

  @Get('types/:slug')
  @ApiOperation({ summary: 'Get mushroom type by slug' })
  getTypeBySlug(@Param('slug') slug: string) {
    return this.mushroomsService.getTypeBySlug(slug);
  }
}
