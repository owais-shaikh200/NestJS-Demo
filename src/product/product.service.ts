import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductDto, userId: string) {
    // Validate subcategory
    const subcategory = await this.prisma.subcategory.findUnique({
      where: { id: dto.subcategoryId },
    });
    if (!subcategory) throw new NotFoundException('Subcategory not found');

    return this.prisma.product.create({
      data: {
        ...dto,
        createdById: userId,
      },
    });
  }

  async findAll() {
    return this.prisma.product.findMany({
      include: {
        subcategory: {
          include: { category: true },
        },
        createdBy: true,
      },
      orderBy: { createdAt: 'desc' },
    });
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

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id); // ensure product exists

    if (dto.subcategoryId) {
      const subcategory = await this.prisma.subcategory.findUnique({
        where: { id: dto.subcategoryId },
      });
      if (!subcategory) throw new NotFoundException('Subcategory not found');
    }

    return this.prisma.product.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
