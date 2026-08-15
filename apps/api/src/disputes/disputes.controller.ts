import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DisputesService } from './disputes.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('disputes')
@ApiBearerAuth()
@Controller({ path: 'disputes', version: '1' })
export class DisputesController {
  constructor(private disputesService: DisputesService) {}

  @Post()
  raise(@CurrentUser() user: any, @Body() dto: any) {
    return this.disputesService.raiseDispute(user.id, dto);
  }

  @Get('mine')
  getMine(@CurrentUser() user: any) {
    return this.disputesService.getMyDisputes(user.id);
  }

  @Get(':id')
  getOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.disputesService.getDispute(id, user.id);
  }

  @Post(':id/evidence')
  addEvidence(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: { evidence: any[] }) {
    return this.disputesService.addEvidence(id, user.id, dto.evidence);
  }
}
