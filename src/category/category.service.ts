import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCategoryDto, userId: string) {
    return this.prisma.category.create({
      data: {
        name: dto.name,
        description: dto.description,
        createdById: userId,
      },
    });
  }

  async findAll(page: number, limit: number, skip: number, take: number) {
    const [categories, total] = await Promise.all([
      this.prisma.category.findMany({
        include: { subcategories: true, createdBy: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.category.count(),
    ]);

    return {
      data: categories,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        subcategories: true,
        createdBy: true,
      },
    });

    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto, userId: string, role: string) {
    const category = await this.findOne(id);

    if (category.createdById !== userId && role !== 'ADMIN') {
      throw new ForbiddenException('You are not allowed to update this category');
    }

    return this.prisma.category.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, userId: string, role: string) {
    const category = await this.findOne(id);

    if (category.createdById !== userId && role !== 'ADMIN') {
      throw new ForbiddenException('You are not allowed to delete this category');
    }

    return this.prisma.category.delete({
      where: { id },
    });
  }
}