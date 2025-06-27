import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  create(@Body() dto: CreateAddressDto, @Req() req: Request) {
    const userId = (req.user as any).id;
    return this.addressService.create(userId, dto);
  }

  @Get()
  findAll(@Req() req: Request) {
    const userId = (req.user as any).id;
    return this.addressService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    const userId = (req.user as any).id;
    return this.addressService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateAddressDto,
    @Req() req: Request,
  ) {
    const userId = (req.user as any).id;
    return this.addressService.update(id, dto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    const userId = (req.user as any).id;
    return this.addressService.remove(id, userId);
  }
}