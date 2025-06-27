import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SupportChatService } from './support-chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({
  cors: {
    origin: '*', // Adjust for production
  },
})
export class SupportChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: SupportChatService,
    private readonly configService: ConfigService,
  ) {}

  afterInit(server: Server) {
    console.log('WebSocket initialized');
  }

  handleConnection(client: Socket) {
    const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.split(' ')[1];

    try {
      const jwtSecret = this.configService.get<string>('JWT_SECRET');
      if (!jwtSecret) {
        throw new Error('JWT secret is not defined');
      }
      const decoded = jwt.verify(token, jwtSecret);
      if (typeof decoded === 'object' && decoded !== null) {
        client.data.userId = (decoded as any).sub;
        client.data.role = (decoded as any).role;
        console.log(`Client connected: ${client.id}, userId: ${(decoded as any).sub}`);
      } else {
        throw new Error('Invalid token payload');
      }
    } catch (err) {
      console.error('Socket connection error:', err.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody() dto: SendMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.userId;
    if (!userId) return;

    const message = await this.chatService.saveMessage(userId, dto);
    this.server.emit('new_message', message);
    return message;
  }
}