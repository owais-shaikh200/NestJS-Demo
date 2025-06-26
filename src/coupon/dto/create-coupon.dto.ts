import { IsString, IsInt, IsDateString } from 'class-validator';

export class CreateCouponDto {
  @IsString()
  code: string;

  @IsInt()
  discount: number;

  @IsDateString()
  expiryDate: string;
}
