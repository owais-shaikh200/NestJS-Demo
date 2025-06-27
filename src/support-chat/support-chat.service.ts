// src/support-chat/support-chat.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SendMessageDto } from './dto/send-message.dto';
import { MarkReadDto } from './dto/mark-read.dto';

@Injectable()
export class SupportChatService {
  constructor(private readonly prisma: PrismaService) {}

  async saveMessage(senderId: string, dto: SendMessageDto) {
    const targetUserId = dto.targetUserId ?? senderId;

    // Find or create the chat for the target user
    let chat = await this.prisma.supportChat.findFirst({
      where: { userId: targetUserId },
    });

    if (!chat) {
      chat = await this.prisma.supportChat.create({
        data: {
          userId: targetUserId,
        },
      });
    }

    // Save the message with senderId (can be admin or user)
    const message = await this.prisma.message.create({
      data: {
        chatId: chat.id,
        senderId,
        content: dto.content,
      },
    });

    return message;
  }

  async markMessageAsRead(dto: MarkReadDto) {
    const message = await this.prisma.message.findUnique({
      where: { id: dto.messageId },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    return this.prisma.message.update({
      where: { id: dto.messageId },
      data: { isRead: true },
    });
  }

  async getUserChat(userId: string) {
    return this.prisma.supportChat.findFirst({
      where: { userId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }

  async getAllChatsWithLastMessage() {
    const chats = await this.prisma.supportChat.findMany({
      include: {
        user: true,
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return chats;
  }
}