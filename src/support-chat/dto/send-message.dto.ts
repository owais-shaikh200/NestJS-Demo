// src/support-chat/dto/send-message.dto.ts

import { IsString, IsOptional, IsUUID } from 'class-validator';

export class SendMessageDto {
  @IsString()
  content: string;

  @IsUUID()
  @IsOptional()
  targetUserId?: string; // Only used when an admin sends a message to a user
}
