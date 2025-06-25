import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { ForbiddenException } from '@nestjs/common';

@Injectable()
export class SubcategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSubcategoryDto, userId: string) {
    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });
    if (!category) throw new NotFoundException('Category not found');

    return this.prisma.subcategory.create({
      data: {
        ...dto,
        createdById: userId,
      },
    });
  }

  async findAll(page: number, limit: number, skip: number, take: number) {
  const [subcategories, total] = await Promise.all([
    this.prisma.subcategory.findMany({
      include: { category: true, createdBy: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
    this.prisma.subcategory.count(),
  ]);

  return {
    data: subcategories,
    meta: {
      total,
      page,
      lastPage: Math.ceil(total / limit),
    },
  };
}


  async findOne(id: string) {
    const subcategory = await this.prisma.subcategory.findUnique({
      where: { id },
      include: {
        category: true,
        createdBy: true,
      },
    });
    if (!subcategory) throw new NotFoundException('Subcategory not found');
    return subcategory;
  }

  async update(id: string, dto: UpdateSubcategoryDto, userId: string, role: string) {
    const subcategory = await this.findOne(id);

    if (subcategory.createdById !== userId && role !== 'ADMIN') {
      throw new ForbiddenException('You are not allowed to update this subcategory');
    }

    if (dto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: dto.categoryId },
      });
      if (!category) throw new NotFoundException('Category not found');
    }

    return this.prisma.subcategory.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, userId: string, role: string) {
    const product = await this.findOne(id);

    if (product.createdById !== userId && role !== 'ADMIN') {
      throw new ForbiddenException('You are not allowed to delete this subcategory');
    }

    return this.prisma.subcategory.delete({ where: { id } });
  }
}
