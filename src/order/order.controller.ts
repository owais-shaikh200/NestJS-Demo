import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { Request } from 'express';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { getPaginationParams } from 'src/utils/pagination';

interface AuthRequest extends Request {
  user: {
    id: string;
    role: string;
  };
}

@UseGuards(JwtAuthGuard)
@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('orders')
  placeOrder(@Req() req: AuthRequest, @Body() dto: CreateOrderDto) {
    return this.orderService.placeOrder(req.user.id, dto);
  }

  @Get('orders/user')
  getUserOrders(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Req() req: AuthRequest,
  ) {
    const { page: currentPage, limit: pageSize, skip, take } = getPaginationParams(page, limit);
    return this.orderService.getUserOrders(req.user.id, currentPage, pageSize, skip, take);
  }

  @Get('orders/:id')
  getOrderById(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.orderService.getOrderById(id, req.user.id, req.user.role);
  }

  @Get('admin/orders')
  @Roles('ADMIN')
  getAllOrders(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('search') search: string,
    @Query('status') status: string,
    @Query('sort') sort: string,
  ) {
    const { page: currentPage, limit: pageSize, skip, take } = getPaginationParams(page, limit);

    return this.orderService.getAllOrdersWithQuery({
      page: currentPage,
      limit: pageSize,
      skip,
      take,
      search,
      status,
      sort,
    });
  }

  @Patch('admin/orders/:id/status')
  @Roles('ADMIN')
  updateOrderStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.orderService.updateOrderStatus(id, status);
  }
}