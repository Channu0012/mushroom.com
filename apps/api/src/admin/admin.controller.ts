import { Controller, Get, Patch, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UserRole, VerificationStatus, UserStatus } from '@prisma/client';
import { AdminService } from './admin.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('admin')
@ApiBearerAuth()
@Roles(UserRole.ADMIN)
@Controller({ path: 'admin', version: '1' })
export class AdminController {
  constructor(private adminService: AdminService) {}

  // ── VERIFICATIONS ─────────────────────────────────────────────
  @Get('verifications')
  @ApiOperation({ summary: 'Get pending verifications (farms or businesses)' })
  getPending(@Query('type') type: 'farm' | 'business' = 'farm') {
    return this.adminService.getPendingVerifications(type);
  }

  @Patch('verifications/farms/:id')
  @ApiOperation({ summary: 'Approve or reject farm verification' })
  updateFarmVerification(
    @Param('id') id: string,
    @CurrentUser() admin: any,
    @Body() dto: { status: VerificationStatus; notes?: string; rejectionReason?: string },
  ) {
    return this.adminService.updateFarmVerification(id, dto.status, admin.id, dto.notes, dto.rejectionReason);
  }

  // ── USERS ─────────────────────────────────────────────────────
  @Get('users')
  @ApiOperation({ summary: 'List all users with filtering' })
  getUsers(
    @Query('page') page = 1, @Query('limit') limit = 20,
    @Query('search') search?: string, @Query('role') role?: string, @Query('status') status?: string,
  ) {
    return this.adminService.getUsers(+page, +limit, search, role, status);
  }

  @Patch('users/:id/status')
  @ApiOperation({ summary: 'Update user status (suspend, activate, etc.)' })
  updateUserStatus(
    @Param('id') id: string, @CurrentUser() admin: any,
    @Body() dto: { status: UserStatus; reason: string },
  ) {
    return this.adminService.updateUserStatus(id, dto.status, admin.id, dto.reason);
  }

  // ── LISTINGS ──────────────────────────────────────────────────
  @Get('listings')
  getListings(@Query('page') page = 1, @Query('limit') limit = 20, @Query('status') status?: string) {
    return this.adminService.getListings(+page, +limit, status);
  }

  @Patch('listings/:id/feature')
  featureListing(@Param('id') id: string, @CurrentUser() admin: any, @Body() dto: { featured: boolean }) {
    return this.adminService.featureListing(id, dto.featured, admin.id);
  }

  // ── DISPUTES ──────────────────────────────────────────────────
  @Get('disputes')
  getDisputes(@Query('page') page = 1, @Query('limit') limit = 20, @Query('status') status?: string) {
    return this.adminService.getDisputes(+page, +limit, status);
  }

  @Patch('disputes/:id/resolve')
  resolveDispute(
    @Param('id') id: string, @CurrentUser() admin: any,
    @Body() dto: { decision: string; resolution: string; refundAmount?: number },
  ) {
    return this.adminService.resolveDispute(id, dto.decision, dto.resolution, admin.id, dto.refundAmount);
  }

  // ── PAYOUTS ───────────────────────────────────────────────────
  @Get('payouts/pending')
  getPendingPayouts(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.adminService.getPendingPayouts(+page, +limit);
  }

  @Patch('payouts/:id/process')
  processPayout(@Param('id') id: string, @CurrentUser() admin: any, @Body() dto: { transactionRef: string }) {
    return this.adminService.processPayout(id, admin.id, dto.transactionRef);
  }

  // ── SETTINGS ──────────────────────────────────────────────────
  @Get('settings')
  getSettings() {
    return this.adminService.getSettings();
  }

  @Patch('settings/:key')
  updateSetting(@Param('key') key: string, @CurrentUser() admin: any, @Body() dto: { value: any }) {
    return this.adminService.updateSetting(key, dto.value, admin.id);
  }
}
