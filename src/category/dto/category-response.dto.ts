import { Expose, Type } from 'class-transformer';
import { SubcategoryInCategoryDto } from './subcategory-in-category.dto';
import { CreatedByUserDto } from './created-by-user.dto';

export class CategoryResponseDto {
  @Expose({ name: 'id' })
  id: string;

  @Expose({ name: 'name' })
  name: string;

  @Expose({ name: 'description' })
  description: string;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;

  @Expose({ name: 'subcategories' })
  @Type(() => SubcategoryInCategoryDto)
  subcategories: SubcategoryInCategoryDto[];

  @Expose({ name: 'created_by' })
  @Type(() => CreatedByUserDto)
  createdBy: CreatedByUserDto;
}
