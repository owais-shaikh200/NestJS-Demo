import { IsUUID } from 'class-validator';

export class MarkReadDto {
  @IsUUID()
  messageId: string;
}
