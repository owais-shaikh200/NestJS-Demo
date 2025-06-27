import { Expose } from 'class-transformer';

export class SubcategoryInCategoryDto {
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
}
