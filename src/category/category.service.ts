import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Category } from "./schema/category.schema";
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Transaction } from 'src/transactions/schema/transaction.schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel("Category") private categoryModel: Model<Category>,
    @InjectModel("Transaction") private transactionModel: Model<Transaction>
  ) {}

  async createCategory(createCategoryDto: CreateCategoryDto, userId: string): Promise<Category> {
    const existingCategory = await this.categoryModel.findOne({
      name: CreateCategoryDto.name,
      userId,
      type: createCategoryDto.type
    });

    if (existingCategory) {
      throw new BadRequestException("Category with this name exists");
    }

    const category = new this.categoryModel({
      ...createCategoryDto,
      userId
    });

    return category.save();
  }

  async getAllCategories(userId: string, type?: "income" | "expense"): Promise<Category[]> {
    const query: any = { userId };
    
    if (type) {
      query.type = type;
    }
    
    return this.categoryModel.find(query).sort({ name: 1 });
  }

  async getCategoryById(id: string, userId: string): Promise<Category> {
    const category = await this.categoryModel.findOne({
      _id: id,
      userId
    });

    if (!category) {
      throw new NotFoundException("Category not found");
    }

    return category;
  }

  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto, userId: string): Promise<Category> {
    const category = await this.categoryModel.findOneAndUpdate(
      { _id: id, userId },
      {
        $set: {
          ...updateCategoryDto
        }
      },
      { new: true, runValidators: true }
    );

    if (!category) {
      throw new NotFoundException("Category not found");
    }

    return category;
  }

  async deleteCategory(id: string, userId: string): Promise<void> {
    const hasTransactions = await this.transactionModel.exists({
      category: id,
      userId
    });

    if (hasTransactions) {
      throw new BadRequestException("Cannot delete category with existing transactions");
    }

    const result = await this.categoryModel.deleteOne({
      _id: id,
      userId,
      isDefault: false
    });

    if (result.deletedCount === 0) {
      throw new NotFoundException("Category not found or cannot be deleted");
    }
  }
}
