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
  UseInterceptors,
  UploadedFiles,
  Query,
  HttpException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../utils/multer.config';
import { getPaginationParams } from '../utils/pagination';
import { uploadToCloudinary } from '../utils/cloudinary-upload';

interface AuthRequest extends Request {
  user: { id: string; role: string };
}

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('images', 5, { storage: multerConfig.storage }))
  async create(
    @Body() dto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: AuthRequest,
  ) {
    const userId = req.user.id;

    let imageUrls: string[] = [];

    try {
      if (files?.length) {
        const uploadPromises = files.map(file => uploadToCloudinary(file.buffer, 'products'));
        imageUrls = await Promise.all(uploadPromises);
      }
    } catch (error) {
      throw new HttpException('Cloudinary upload failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return this.productService.create(dto, userId, imageUrls);
  }

  @Get()
  findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('search') search: string,
    @Query('categoryId') categoryId: string,
    @Query('subcategoryId') subcategoryId: string,
    @Query('minPrice') minPrice: string,
    @Query('maxPrice') maxPrice: string,
    @Query('inStock') inStock: string,
    @Query('sort') sort: string,
  ) {
    const { page: currentPage, limit: pageSize, skip, take } = getPaginationParams(page, limit);

    return this.productService.findAll({
      page: currentPage,
      limit: pageSize,
      skip,
      take,
      search,
      categoryId,
      subcategoryId,
      minPrice,
      maxPrice,
      inStock,
      sort,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @Roles('ADMIN', 'USER')
  @UseInterceptors(FilesInterceptor('images', 5, { storage: multerConfig.storage }))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: AuthRequest,
  ) {
    const { id: userId, role } = req.user;
    let imageUrls: string[] = [];

    try {
      if (files?.length) {
        const uploadPromises = files.map(file => uploadToCloudinary(file.buffer, 'products'));
        imageUrls = await Promise.all(uploadPromises);
      }
    } catch (error) {
      throw new HttpException('Cloudinary image upload failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return this.productService.update(id, dto, userId, role, imageUrls);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @Roles('ADMIN', 'USER')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.productService.remove(id, req.user.id, req.user.role);
  }
}