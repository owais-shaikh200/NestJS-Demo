// src/auth/dto/login-response.dto.ts
import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from './user-response.dto';

export class LoginResponseDto {
  @Expose({ name: 'access_token' })
  accessToken: string;

  @Expose({ name: 'user' })
  @Type(() => UserResponseDto)
  user: UserResponseDto;
}
