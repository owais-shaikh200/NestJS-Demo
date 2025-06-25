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
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { Request } from 'express';
import { SubcategoryService } from './subcategory.service';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { getPaginationParams } from 'src/utils/pagination';

interface AuthRequest extends Request {
  user: { id: string; role: string };
}

@Controller('subcategories')
export class SubcategoryController {
  constructor(private readonly subcategoryService: SubcategoryService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateSubcategoryDto, @Req() req: AuthRequest) {
    return this.subcategoryService.create(dto, req.user.id);
  }

  @Get()
  findAll(@Query('page') page: string, @Query('limit') limit: string) {
    const { page: currentPage, limit: pageSize, skip, take } = getPaginationParams(page, limit);
    return this.subcategoryService.findAll(currentPage, pageSize, skip, take);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subcategoryService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @Roles('ADMIN', 'USER')
  update(@Param('id') id: string, @Body() dto: UpdateSubcategoryDto, @Req() req: AuthRequest) {
    return this.subcategoryService.update(id, dto, req.user.id, req.user.role);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @Roles('ADMIN', 'USER')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.subcategoryService.remove(id, req.user.id, req.user.role);
  }
}
