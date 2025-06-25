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
import { CreateOrderDto } from  './dto/create-order.dto';
import { getPaginationParams } from 'src/utils/pagination';

@UseGuards(JwtAuthGuard)
@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('orders')
  placeOrder(@Req() req: Request, @Body() dto: CreateOrderDto) {
    const userId = (req.user as any).id;
    return this.orderService.placeOrder(userId, dto);
  }

  @Get()
@UseGuards(JwtAuthGuard)
getUserOrders(
  @Query('page') page: string,
  @Query('limit') limit: string,
  @Req() req: Request,
) {
  const userId = (req.user as any).id;
  const { page: currentPage, limit: pageSize, skip, take } = getPaginationParams(page, limit);
  return this.orderService.getUserOrders(userId, currentPage, pageSize, skip, take);
}


  @Get('orders/:id')
  getOrderById(@Param('id') id: string, @Req() req: Request) {
    const userId = (req.user as any).id;
    const role = (req.user as any).role;
    return this.orderService.getOrderById(id, userId, role);
  }

  @Get()
@UseGuards(JwtAuthGuard)
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



  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  @Patch('admin/orders/:id/status')
  updateOrderStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.orderService.updateOrderStatus(id, status);
  }
}
