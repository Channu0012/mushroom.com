import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('messages')
@ApiBearerAuth()
@Controller({ path: 'conversations', version: '1' })
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Post()
  createConversation(@CurrentUser() user: any, @Body() dto: { otherUserId: string; listingId?: string; requirementId?: string }) {
    return this.messagesService.createOrGetConversation(user.id, dto.otherUserId, { listingId: dto.listingId, requirementId: dto.requirementId });
  }

  @Get()
  getConversations(@CurrentUser() user: any, @Query('page') page = 1, @Query('limit') limit = 20) {
    return this.messagesService.getMyConversations(user.id, +page, +limit);
  }

  @Get(':id/messages')
  getMessages(@CurrentUser() user: any, @Param('id') id: string, @Query('page') page = 1, @Query('limit') limit = 50) {
    return this.messagesService.getMessages(id, user.id, +page, +limit);
  }

  @Post(':id/messages')
  sendMessage(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: { content: string; attachments?: any[] }) {
    return this.messagesService.sendMessage(id, user.id, dto.content, dto.attachments);
  }
}
