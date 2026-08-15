import { Controller, Get, Post, Patch, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RequirementsService } from './requirements.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('requirements')
@ApiBearerAuth()
@Controller({ path: 'requirements', version: '1' })
export class RequirementsController {
  constructor(private requirementsService: RequirementsService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() dto: any) {
    return this.requirementsService.create(user.id, dto);
  }

  @Public()
  @Get()
  discover(@Query() filters: any) {
    return this.requirementsService.discover(filters);
  }

  @Get('mine')
  getMine(@CurrentUser() user: any, @Query('page') page = 1, @Query('limit') limit = 20) {
    return this.requirementsService.getMine(user.id, +page, +limit);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requirementsService.findOne(id);
  }

  @Patch(':id')
  update(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: any) {
    return this.requirementsService.update(user.id, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  cancel(@CurrentUser() user: any, @Param('id') id: string) {
    return this.requirementsService.cancel(user.id, id);
  }
}
