import { Expose, Type } from 'class-transformer';
import { CartItemResponseDto } from './cart-item-response.dto';

export class CartResponseDto {
  @Expose({ name: 'id' })
  id: string;

  @Expose({ name: 'user_id' })
  userId: string;

  @Expose({ name: 'items' })
  @Type(() => CartItemResponseDto)
  items: CartItemResponseDto[];

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;
}
