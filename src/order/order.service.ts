import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from '@prisma/client';
import { buildOrderFilter } from 'src/utils/filter.helper';
import { buildOrderSearchFilter } from 'src/utils/search.helper';
import { getOrderSortOption } from 'src/utils/sort.helper';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async placeOrder(userId: string, dto: CreateOrderDto) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart || cart.items.length === 0) {
      throw new NotFoundException('Cart is empty');
    }

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const order = await this.prisma.order.create({
      data: {
        userId,
        totalAmount,
        status: 'PENDING',
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    return order;
  }

  async getUserOrders(userId: string, page: number, limit: number, skip: number, take: number) {
  const [orders, total] = await Promise.all([
    this.prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
    this.prisma.order.count({ where: { userId } }),
  ]);

  return {
    data: orders,
    meta: {
      total,
      page,
      lastPage: Math.ceil(total / limit),
    },
  };
}

  async getOrderById(orderId: string, userId: string, role: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) throw new NotFoundException('Order not found');

    if (order.userId !== userId && role !== 'ADMIN') {
      throw new ForbiddenException('Access denied');
    }

    return order;
  }

  async getAllOrders(page: number, limit: number, skip: number, take: number) {
  const [orders, total] = await Promise.all([
    this.prisma.order.findMany({
      include: { items: true, user: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
    this.prisma.order.count(),
  ]);

  return {
    data: orders,
    meta: {
      total,
      page,
      lastPage: Math.ceil(total / limit),
    },
  };
}

async getAllOrdersWithQuery(params: {
  page: number;
  limit: number;
  skip: number;
  take: number;
  search?: string;
  status?: string;
  sort?: string;
}) {
  const { page, limit, skip, take, search, status, sort } = params;

  const baseFilter = buildOrderFilter({ status });
  const searchFilter = buildOrderSearchFilter(search);
  const orderBy = getOrderSortOption(sort);

  const where = {
    ...baseFilter,
    ...(searchFilter || {}),
  };

  const [orders, total] = await Promise.all([
    this.prisma.order.findMany({
      where,
      include: { items: true, user: true },
      skip,
      take,
      orderBy,
    }),
    this.prisma.order.count({ where }),
  ]);

  return {
    data: orders,
    meta: {
      total,
      page,
      lastPage: Math.ceil(total / limit),
    },
  };
}



  async updateOrderStatus(orderId: string, status: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: status as OrderStatus },
    });
  }
}
