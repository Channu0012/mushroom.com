import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { AnalyticsService } from './analytics.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('analytics')
@ApiBearerAuth()
@Controller({ path: 'analytics', version: '1' })
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('marketplace')
  @Roles(UserRole.ADMIN)
  getMarketplace() {
    return this.analyticsService.getMarketplaceMetrics();
  }

  @Get('grower')
  @Roles(UserRole.GROWER)
  getGrowerAnalytics(@CurrentUser() user: any) {
    return this.analyticsService.getGrowerAnalytics(user.id);
  }
}
