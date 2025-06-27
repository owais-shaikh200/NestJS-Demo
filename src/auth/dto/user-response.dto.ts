import { Expose } from 'class-transformer';
import { Role } from '@prisma/client';

export class UserResponseDto {
  @Expose({ name: 'id' })
  id: string;

  @Expose({ name: 'email' })
  email: string;

  @Expose({ name: 'name' })
  name: string;

  @Expose({ name: 'role' })
  role: Role;

  @Expose({ name: 'created_at' })
  createdAt: Date;
}
