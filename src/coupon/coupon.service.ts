import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCouponDto } from './dto/create-coupon.dto';

@Injectable()
export class CouponService {
  constructor(private readonly prisma: PrismaService) {}

  async createCoupon(dto: CreateCouponDto) {
    const exists = await this.prisma.coupon.findUnique({
      where: { code: dto.code },
    });

    if (exists) throw new ConflictException('Coupon code already exists');

    return this.prisma.coupon.create({
      data: {
        code: dto.code,
        discount: dto.discount,
        expiryDate: new Date(dto.expiryDate),
      },
    });
  }

  async validateCoupon(code: string) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { code },
    });

    if (!coupon) throw new NotFoundException('Coupon not found');

    const now = new Date();
    if (coupon.expiryDate < now) {
      throw new ConflictException('Coupon has expired');
    }

    return coupon;
  }

  async getAllCoupons() {
    return this.prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteCoupon(id: string) {
    await this.prisma.coupon.findUniqueOrThrow({
      where: { id },
    });

    return this.prisma.coupon.delete({ where: { id } });
  }
}
