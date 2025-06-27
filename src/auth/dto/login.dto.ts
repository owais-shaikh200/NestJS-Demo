import { IsEmail, IsNotEmpty } from 'class-validator';
import { Exclude } from 'class-transformer';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  constructor(partial: Partial<LoginDto>) {
    Object.assign(this, partial);
  }
}
