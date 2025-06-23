import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

update(id: number, data: { email?: string; name?: string }) {
    return this.prisma.user.update({
    where: { id },
    data,
    });
}

  create(data: { email: string; name?: string }) {
    return this.prisma.user.create({ data });
  }

  delete(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
