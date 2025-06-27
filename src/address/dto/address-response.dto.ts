import { Expose, Type } from 'class-transformer';
import { AddressType } from '@prisma/client';

export class AddressResponseDto {
  @Expose({ name: 'id' })
  id: string;

  @Expose({ name: 'user_id' })
  userId: string;

  @Expose({ name: 'type' })
  type: AddressType;

  @Expose({ name: 'full_name' })
  fullName: string;

  @Expose({ name: 'phone' })
  phone: string;

  @Expose({ name: 'street' })
  street: string;

  @Expose({ name: 'city' })
  city: string;

  @Expose({ name: 'state' })
  state: string;

  @Expose({ name: 'postal_code' })
  postalCode: string;

  @Expose({ name: 'country' })
  country: string;

  @Expose({ name: 'is_default' })
  isDefault: boolean;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;
}
