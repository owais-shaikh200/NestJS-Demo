import {
  Controller,
  Get,
  Param,
  UseGuards,
  Patch,
  Body,
} from '@nestjs/common';
import { SupportChatService } from './support-chat.service';
import { MarkReadDto } from './dto/mark-read.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'; // adjust based on your auth location
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('support-chat')
export class SupportChatController {
  constructor(private readonly chatService: SupportChatService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin/chats')
  getAllChats() {
    return this.chatService.getAllChatsWithLastMessage();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin/chats/:userId')
  getUserChat(@Param('userId') userId: string) {
    return this.chatService.getUserChat(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('read')
  markAsRead(@Body() dto: MarkReadDto) {
    return this.chatService.markMessageAsRead(dto);
  }
}
