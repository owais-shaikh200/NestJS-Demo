import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @IsPositive()
  @Type(() => Number) // ensures string from FormData is converted
  price: number;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  stock: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[]; // Optional since uploaded and added server-side

  @IsUUID()
  subcategoryId: string;
}
