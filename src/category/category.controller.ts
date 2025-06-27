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
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { getPaginationParams } from 'src/utils/pagination';

interface AuthRequest extends Request {
  user: { id: string; role: string };
}

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateCategoryDto, @Req() req: AuthRequest) {
    return this.categoryService.create(dto, req.user.id);
  }

  @Get()
  findAll(@Query('page') page: string, @Query('limit') limit: string) {
    const { page: currentPage, limit: pageSize, skip, take } = getPaginationParams(page, limit);
    return this.categoryService.findAll(currentPage, pageSize, skip, take);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @Roles('ADMIN', 'USER')
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto, @Req() req: AuthRequest) {
    return this.categoryService.update(id, dto, req.user.id, req.user.role);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles('ADMIN', 'USER')
  remove(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.categoryService.remove(id, req.user.id, req.user.role);
  }
}