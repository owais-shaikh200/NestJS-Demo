import { IsEmail, IsNotEmpty, MinLength, IsEnum } from 'class-validator';
import { Role } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class SignupDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Exclude()
  password: string;

  @IsNotEmpty()
  name: string;

  @IsEnum(Role, { message: 'Role must be either USER or ADMIN' })
  role: Role;

  constructor(partial: Partial<SignupDto>) {
    Object.assign(this, partial);
  }
}
