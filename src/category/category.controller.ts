import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from "../helper/jwt-auth.guard";
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';

@Controller('category')
@UseGuards(JwtAuthGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @CurrentUser() user: any
  ) {
    return this.categoryService.createCategory(createCategoryDto, user.userId);
  }

  @Get()
  getAllCategories(
    @CurrentUser() user: any
  ) {
    return this.categoryService.getAllCategories(user.userId);
  }

  @Get(':id')
  getCategoryById(
    @Param('id') id: string,
    @CurrentUser() user: any
  ) {
    return this.categoryService.getCategoryById(id, user.userId);
  }

  @Put(':id')
  updateCategory(
    @Param('id') id: string, 
    @Body() updateCategoryDto: UpdateCategoryDto,
    @CurrentUser() user: any
  ) {
    return this.categoryService.updateCategory(id, updateCategoryDto, user.userId);
  }

  @Delete(':id')
  deleteCategory(
    @Param('id') id: string,
    @CurrentUser() user: any
  ) {
    return this.categoryService.deleteCategory(id, user.userId);
  }
}
