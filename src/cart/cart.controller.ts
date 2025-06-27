import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

interface AuthRequest extends Request {
  user: {
    id: string;
    role: string;
  };
}

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getUserCart(@Req() req: AuthRequest) {
    const userId = req.user.id;
    return this.cartService.getOrCreateCart(userId);
  }

  @Post('add')
  addToCart(@Req() req: AuthRequest, @Body() dto: AddToCartDto) {
    const userId = req.user.id;
    return this.cartService.addToCart(userId, dto);
  }

  @Patch('update/:itemId')
  updateQuantity(
    @Req() req: AuthRequest,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateCartDto
  ) {
    const userId = req.user.id;
    return this.cartService.updateCartItemQuantity(userId, itemId, dto.quantity);
  }

  @Delete('remove/:itemId')
  removeItem(@Req() req: AuthRequest, @Param('itemId') itemId: string) {
    const userId = req.user.id;
    return this.cartService.removeCartItem(userId, itemId);
  }

  @Delete('clear')
  clearCart(@Req() req: AuthRequest) {
    const userId = req.user.id;
    return this.cartService.clearUserCart(userId);
  }
}