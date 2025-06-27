import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      select: { id: true, email: true, name: true, 
        role: true,
        createdAt: true },
    });
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, createdAt: true },
    });
  }

  update(id: string, data: Partial<{ name: string }>) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: { id: true, email: true, name: true, createdAt: true },
    });
  }

  remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}