import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';

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

  async findAll() {
    return this.prisma.subcategory.findMany({
      include: {
        category: true,
        createdBy: true,
      },
      orderBy: { createdAt: 'desc' },
    });
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

  async update(id: string, dto: UpdateSubcategoryDto) {
    await this.findOne(id);

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

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.subcategory.delete({ where: { id } });
  }
}
