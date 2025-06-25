import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { cloudinary } from '../utils/cloudinary';
import { buildProductSearchFilter } from '../utils/search.helper';
import { buildProductFilter } from '../utils/filter.helper';
import { getProductSortOption } from '../utils/sort.helper';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductDto, userId: string, imageUrls: string[]) {
    const subcategory = await this.prisma.subcategory.findUnique({
      where: { id: dto.subcategoryId },
    });
    if (!subcategory) throw new NotFoundException('Subcategory not found');

    return this.prisma.product.create({
      data: {
        ...dto,
        createdById: userId,
        images: imageUrls,
      },
    });
  }

  async findAll(filters: {
  page: number;
  limit: number;
  skip: number;
  take: number;
  search?: string;
  categoryId?: string;
  subcategoryId?: string;
  minPrice?: string;
  maxPrice?: string;
  inStock?: string;
  sort?: string;
}) {
  const {
    page, limit, skip, take,
    search, sort,
    ...filterParams
  } = filters;

  const searchFilter = buildProductSearchFilter(search);
  const baseFilter = buildProductFilter(filterParams);
  const orderBy = getProductSortOption(sort);

  const where = {
    ...baseFilter,
    ...(searchFilter ?? {}),
  };

  const [products, total] = await Promise.all([
    this.prisma.product.findMany({
      where,
      skip,
      take,
      orderBy,
      include: {
        subcategory: { include: { category: true } },
        createdBy: true,
      },
    }),
    this.prisma.product.count({ where }),
  ]);

  return {
    data: products,
    meta: {
      total,
      page,
      lastPage: Math.ceil(total / limit),
    },
  };
}


  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        subcategory: {
          include: { category: true },
        },
        createdBy: true,
      },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(
    id: string,
    dto: UpdateProductDto,
    userId: string,
    role: string,
    newImageUrls: string[],
  ) {
    const product = await this.findOne(id);

    if (product.createdById !== userId && role !== 'ADMIN') {
      throw new ForbiddenException('You are not allowed to update this product');
    }

    if (dto.subcategoryId) {
      const subcategory = await this.prisma.subcategory.findUnique({
        where: { id: dto.subcategoryId },
      });
      if (!subcategory) throw new NotFoundException('Subcategory not found');
    }

    // Delete old images from Cloudinary if new images are uploaded
    if (newImageUrls.length > 0 && product.images.length > 0) {
      await Promise.all(
        product.images.map(async (url) => {
          const publicId = this.extractPublicId(url);
          if (publicId) {
            await cloudinary.uploader.destroy(publicId);
          }
        }),
      );
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        ...dto,
        images: newImageUrls.length > 0 ? newImageUrls : product.images,
      },
    });
  }

  async remove(id: string, userId: string, role: string) {
    const product = await this.findOne(id);

    if (product.createdById !== userId && role !== 'ADMIN') {
      throw new ForbiddenException('You are not allowed to delete this product');
    }

    // Delete all associated Cloudinary images
    await Promise.all(
      product.images.map(async (url) => {
        const publicId = this.extractPublicId(url);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      }),
    );

    return this.prisma.product.delete({
      where: { id },
    });
  }

  // 🔧 Helper: Extract publicId from Cloudinary URL
  private extractPublicId(url: string): string | null {
    try {
      const parts = url.split('/');
      const filename = parts[parts.length - 1];
      const [publicId] = filename.split('.');
      return `products/${publicId}`;
    } catch {
      return null;
    }
  }
}
