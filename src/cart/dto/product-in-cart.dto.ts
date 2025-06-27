import { Expose } from 'class-transformer';

export class ProductInCartDto {
  @Expose({ name: 'id' })
  id: string;

  @Expose({ name: 'name' })
  name: string;

  @Expose({ name: 'price' })
  price: number;

  @Expose({ name: 'stock' })
  stock: number;

  @Expose({ name: 'images' })
  images: string[];
}
