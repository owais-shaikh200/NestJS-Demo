import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { CouponModule } from '../coupon/coupon.module';


@Module({
  imports: [CouponModule],
  providers: [OrderService],
  controllers: [OrderController]
})
export class OrderModule {}
