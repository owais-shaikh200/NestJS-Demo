import { Expose, Type } from 'class-transformer';
import { CategoryResponseDto } from './category-response.dto';

class MetaDto {
  @Expose()
  total: number;

  @Expose()
  page: number;

  @Expose({ name: 'last_page' })
  lastPage: number;
}

export class PaginatedCategoryResponseDto {
  @Expose()
  @Type(() => CategoryResponseDto)
  data: CategoryResponseDto[];

  @Expose()
  @Type(() => MetaDto)
  meta: MetaDto;
}
