import { Controller, Query, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from "../helper/jwt-auth.guard";
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CurrentUser } from "../auth/decorator/current-user.decorator";
import { TransactionFilters } from 'src/types/filters.type';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  createTransaction(
    @Body() createTransactionDto: CreateTransactionDto,
    @CurrentUser() user: any,
  ) {
    return this.transactionsService.createTransaction(createTransactionDto, user.userId);
  }

  @Get()
  getAllTransactions(
    @CurrentUser() user: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('category') category?: string,
    @Query('isRecurring') isRecurring?: string
  ) {
    const filters: TransactionFilters = {
      startDate,
      endDate,
      category,
      isRecurring: isRecurring ? isRecurring === "true" : undefined
    }

    return this.transactionsService.getAllTransactions(user.userId, filters);
  }

  @Get("balance")
  async getBalance(@CurrentUser() user: any) {
    return this.transactionsService.getBalance(user.userId);
  }

  @Get("monthlySummary")
  async getMonthlyBalance(@CurrentUser() user: any) {
    return this.transactionsService.getMonthlyBalance(user.userId);
  }

  @Get(':id')
  getTransactionById(
    @Param('id') id: string,
    @CurrentUser() user: any
  ) {
    return this.transactionsService.getTransactionById(user.userId, id);
  }

  @Put(':id')
  updateTransactionById(
    @Param('id') id: string, 
    @Body() updateTransactionDto: CreateTransactionDto,
    @CurrentUser() user: any
  ) {
    return this.transactionsService.updateTransactionById(id, updateTransactionDto, user.userId);
  }

  @Delete(':id')
  deleteTransactionById(
    @Param('id') id: string,
    @CurrentUser() user: any
  ) {
    return this.transactionsService.deleteTransactionById(id, user.userId);
  }
}
