import { Expose } from 'class-transformer';
import { Role } from '@prisma/client';

export class CreatedByUserDto {
  @Expose({ name: 'id' })
  id: string;

  @Expose({ name: 'email' })
  email: string;

  @Expose({ name: 'name' })
  name: string;

  @Expose({ name: 'role' })
  role: Role;
}