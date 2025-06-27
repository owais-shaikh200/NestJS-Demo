import { Expose } from 'class-transformer';

export class CouponResponseDto {
  @Expose({ name: 'id' })
  id: string;

  @Expose({ name: 'code' })
  code: string;

  @Expose({ name: 'discount' })
  discount: number;

  @Expose({ name: 'expiry_date' })
  expiryDate: Date;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;
}
