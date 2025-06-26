import { Module } from '@nestjs/common';
import { SupportChatService } from './support-chat.service';
import { SupportChatController } from './support-chat.controller';
import { SupportChatGateway } from './support-chat.gateway';

@Module({
  providers: [SupportChatService, SupportChatGateway],
  controllers: [SupportChatController]
})
export class SupportChatModule {}
