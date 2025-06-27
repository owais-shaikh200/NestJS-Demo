import { IsString, IsOptional, IsUUID } from 'class-validator';

export class SendMessageDto {
  @IsString()
  content: string;

  @IsUUID()
  @IsOptional()
  targetUserId?: string;
}
