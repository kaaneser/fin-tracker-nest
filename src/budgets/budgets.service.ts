import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from 'src/category/schema/category.schema';
import { Budget } from './schema/budget.schema';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@Injectable()
export class BudgetsService {
  constructor(
    @InjectModel("Budget") private budgetModel: Model<Budget>,
    @InjectModel("Category") private categoryModel: Model<Category>
  ) {}

  async createBudget(createBudgetDto: CreateBudgetDto, userId: string): Promise<Budget> {
    const budget = new this.budgetModel({
      ...createBudgetDto,
      userId
    });

    return budget.save();
  }

  async getAllBudgets(userId: string): Promise<Budget[]> {
    return this.budgetModel.find({ userId })
      .populate("category", "name type")
      .sort({ date: -1 });
  }

  async getBudgetById(id: string, userId: string): Promise<Budget | null> {
    const budget = this.budgetModel.findOne({ userId, _id: id })
      .populate("category", "name type");

    if (!budget) {
      throw new NotFoundException("Budget not found");
    }

    return budget;
  }

  async updateBudgetById(id: string, updateBudgetDto: CreateBudgetDto, userId: string) {
    const updatedBudget = await this.budgetModel.findOneAndUpdate(
      { userId, _id: id },
      { $set: updateBudgetDto },
      { new: true, runValidators: true }
    );

    if (!updatedBudget) {
      throw new Error("Budget not found or user is not authorized");
    }

    return updatedBudget;
  }

  async deleteBudgetById(id: string, userId: string): Promise<{}> {
    const deletedBudget = await this.budgetModel.findOneAndDelete({ userId, _id: id });

    if (!deletedBudget) {
      throw new Error("Budget not found or user is not authorized");
    }

    return {
      success: true,
      message: `Budget with id ${id} deleted successfully`
    };
  }

  async getBudgetStatusById(id: string, userId: string): Promise<Budget | null> {
    const budget = this.budgetModel.findOne({ userId, _id: id })
      .populate("category", "name type");

    if (!budget) {
      throw new NotFoundException("Budget not found");
    }

    return budget;
  }
}
