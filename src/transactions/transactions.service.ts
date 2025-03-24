import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Transaction } from "./schema/transaction.schema";
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Category } from 'src/category/schema/category.schema';
import { calculateNextExecDate } from 'src/utils/calculateNextExecDate';
import { TransactionFilters } from 'src/types/filters.type';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel("Transaction") private transactionModel: Model<Transaction>,
    @InjectModel("Category") private categoryModel: Model<Category>
  ) {}

  async createTransaction(createTransactionDto: CreateTransactionDto, userId: string): Promise<Transaction> {
    const transactionData: any = {
      ...createTransactionDto,
      userId
    };

    if (createTransactionDto.isRecurring && createTransactionDto.frequency) {
      transactionData.nextExecDate = await calculateNextExecDate(new Date(), createTransactionDto.frequency);
    }
    
    const transaction = new this.transactionModel(transactionData);

    return transaction.save();
  }

  async getAllTransactions(
    userId: string,
    filters?: TransactionFilters
  ): Promise<Transaction[]> {
    const query: any = { userId };

    if (filters?.startDate || filters?.endDate) {
      query.date = {};

      if (filters.startDate) query.date.$gte = new Date(filters.startDate);
      if (filters.endDate) query.date.$lte = new Date(filters.endDate);
    }

    if (filters?.category) {
      query.category = filters.category;
    }

    if (filters?.isRecurring !== undefined) {
      query.isRecurring = filters.isRecurring;
    }

    return this.transactionModel.find(query)
      .populate("category", "name type")
      .sort({ date: -1 });
  }

  async getTransactionById(userId: string, id: string): Promise<Transaction | null> {
    const transaction = this.transactionModel.findOne({ userId, _id: id })
      .populate("category", "name type");

    if (!transaction) {
      throw new NotFoundException("Transaction not found");
    }

    return transaction;
  }

  async getBalance(userId: string): Promise<{ userId: string; totalBalance: number }> {
    const transactions = await this.transactionModel.find({ userId })
      .populate("category", "type");

    const totalBalance = transactions.reduce((balance, transaction) => {
      const multiplier = transaction.category["type"] === "income" ? 1 : -1;
      return balance + (transaction.amount * multiplier);
    }, 0);

    return {
      userId,
      totalBalance
    };
  }

  async getMonthlyBalance(userId: string): Promise<any> {
    const transactions = await this.transactionModel
      .find({ userId })
      .populate("category", "type");

    const monthlySummary: { [key: string]: { income: number; expense: number } } = {};

    for (const transaction of transactions) {
      const month = transaction.date.toISOString().slice(0, 7);

      if (!monthlySummary[month]) {
        monthlySummary[month] = { income: 0, expense: 0 };
      }

      if (transaction.category["type"] === "income") {
        monthlySummary[month]["income"] += transaction.amount;
      } else {
        monthlySummary[month]["expense"] += transaction.amount;
      }
    }

    return monthlySummary;
  }

  async updateTransactionById(id: string, updateTransactionDto: CreateTransactionDto, userId: string) {
    if (updateTransactionDto.isRecurring && updateTransactionDto.frequency) {
      updateTransactionDto.nextExecDate = await calculateNextExecDate(new Date(), updateTransactionDto.frequency);
    }
    
    const updatedTransaction = await this.transactionModel.findOneAndUpdate(
      { userId, _id: id },
      { $set: updateTransactionDto },
      { new: true, runValidators: true }
    );

    if (!updatedTransaction) {
      throw new Error("Transaction not found or user is not authorized");
    }

    return updatedTransaction;
  }

  async deleteTransactionById(id: string, userId: string): Promise<{}> {
    const deletedTransaction = await this.transactionModel.findOneAndDelete({ userId, _id: id });

    if (!deletedTransaction) {
      throw new Error("Transaction not found or user is not authorized");
    }

    return {
      success: true,
      message: `Transaction with id ${id} deleted successfully`
    };
  }
}
