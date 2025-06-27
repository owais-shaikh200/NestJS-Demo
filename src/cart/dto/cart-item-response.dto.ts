import { Expose, Type } from 'class-transformer';
import { ProductInCartDto } from './product-in-cart.dto';

export class CartItemResponseDto {
  @Expose({ name: 'id' })
  id: string;

  @Expose({ name: 'quantity' })
  quantity: number;

  @Expose({ name: 'price' })
  price: number;

  @Expose({ name: 'product' })
  @Type(() => ProductInCartDto)
  product: ProductInCartDto;
}
