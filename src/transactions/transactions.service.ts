import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Transaction } from "./schema/transaction.schema";
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Category } from 'src/category/schema/category.schema';


@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel("Transaction") private transactionModel: Model<Transaction>,
    @InjectModel("Category") private categoryModel: Model<Category>
  ) {}

  async createTransaction(createTransactionDto: CreateTransactionDto, userId: string): Promise<Transaction> {
    const transaction = new this.transactionModel({
      ...createTransactionDto,
      userId
    });

    return transaction.save();
  }

  async getAllTransactions(userId: string): Promise<Transaction[]> {
    return this.transactionModel.find({ userId })
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

  async updateTransactionById(id: string, updateTransactionDto: CreateTransactionDto, userId: string) {
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
