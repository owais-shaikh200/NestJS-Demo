import { IsEmail, IsNotEmpty, MinLength, IsEnum } from 'class-validator';
import { Role } from '@prisma/client';

export class SignupDto {
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsNotEmpty()
  name: string;

  @IsEnum(Role, { message: 'Role must be either USER or ADMIN' })
  role: Role;

  constructor(partial: Partial<SignupDto>) {
    Object.assign(this, partial);
  }
}
