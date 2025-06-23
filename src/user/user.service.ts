import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // ✅ We intentionally do NOT expose create user here
  // Let AuthService handle user creation (signup)

  findAll() {
    return this.prisma.user.findMany({
      select: { id: true, email: true, name: true, createdAt: true },
    });
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, createdAt: true },
    });
  }

  update(id: number, data: Partial<{ name: string }>) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: { id: true, email: true, name: true, createdAt: true },
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
