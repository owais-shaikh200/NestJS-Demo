import { IsUUID, IsInt, Min } from 'class-validator';

export class UpdateCartDto {
  @IsUUID(undefined, { message: 'Invalid product ID' })
  productId: string;

  @IsInt({ message: 'Quantity must be an integer' })
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity: number;
}
