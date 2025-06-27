import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AddressType, OrderStatus } from '@prisma/client';
import { buildOrderFilter } from 'src/utils/filter.helper';
import { buildOrderSearchFilter } from 'src/utils/search.helper';
import { getOrderSortOption } from 'src/utils/sort.helper';
import { CouponService } from '../coupon/coupon.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly couponService: CouponService,
  ) {}

  async placeOrder(userId: string, dto: CreateOrderDto) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart || cart.items.length === 0) {
      throw new NotFoundException('Cart is empty');
    }

    // Step 1: Validate stock for each product
    for (const item of cart.items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new NotFoundException(`Product not found: ${item.productId}`);
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for ${product.name}`,
        );
      }
    }

    const [shippingAddress, billingAddress] = await Promise.all([
      this.prisma.address.findFirst({
        where: {
          userId,
          isDefault: true,
          type: AddressType.SHIPPING,
        },
      }),
      this.prisma.address.findFirst({
        where: {
          userId,
          isDefault: true,
          type:  AddressType.BILLING,
        },
      }),
    ]);

    if (!shippingAddress || !billingAddress) {
      throw new BadRequestException(
        'Default shipping or billing address not found',
      );
    }

    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    let discount = 0;
    let appliedCouponCode: string | null = null;

    if (dto.couponCode) {
      const coupon = await this.couponService.validateCoupon(dto.couponCode);
      discount = coupon.discount;
      appliedCouponCode = coupon.code;
    }

    const totalAmount = Math.max(subtotal - discount, 0);

    // Step 4: Create order
    const order = await this.prisma.order.create({
      data: {
        userId,
        totalAmount,
        discount,
        couponCode: appliedCouponCode,
        status: 'PENDING',
        shippingAddressId: shippingAddress.id,
        billingAddressId: billingAddress.id,
        orderItems: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        orderItems: true,
        shippingAddress: true,
        billingAddress: true,
      },
    });

    // Step 5: Update product stock and sales
    for (const item of cart.items) {
      await this.prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: { decrement: item.quantity },
          sales: { increment: item.quantity },
        },
      });
    }

    // Step 6: Clear user's cart
    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    return order;
  }

  async getUserOrders(
    userId: string,
    page: number,
    limit: number,
    skip: number,
    take: number,
  ) {
    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { userId },
        include: {
          orderItems: true,
          shippingAddress: true,
          billingAddress: true,
        },
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
      include: {
        orderItems: true,
        shippingAddress: true,
        billingAddress: true,
      },
    });

    if (!order) throw new NotFoundException('Order not found');

    if (order.userId !== userId && role !== 'ADMIN') {
      throw new ForbiddenException('Access denied');
    }

    return order;
  }

  async getAllOrders(
    page: number,
    limit: number,
    skip: number,
    take: number,
  ) {
    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        include: {
          orderItems: true,
          user: true,
          shippingAddress: true,
          billingAddress: true,
        },
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
        include: { orderItems: true, user: true },
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
