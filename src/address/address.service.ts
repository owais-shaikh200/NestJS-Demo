import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateAddressDto) {
    if (dto.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId, type: dto.type },
        data: { isDefault: false },
      });
    }

    return this.prisma.address.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const address = await this.prisma.address.findUnique({ where: { id } });
    if (!address || address.userId !== userId) {
      throw new NotFoundException('Address not found');
    }
    return address;
  }

  async update(id: string, dto: UpdateAddressDto, userId: string) {
    const address = await this.findOne(id, userId);

    if (dto.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId, type: address.type },
        data: { isDefault: false },
      });
    }

    return this.prisma.address.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, userId: string) {
    const address = await this.findOne(id, userId);
    return this.prisma.address.delete({ where: { id } });
  }
}
