import { Module } from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { BudgetsController } from './budgets.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema } from 'src/category/schema/category.schema';
import { BudgetSchema } from './schema/budget.schema';
import { TransactionSchema } from 'src/transactions/schema/transaction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "Budget", schema: BudgetSchema },
      { name: "Category", schema: CategorySchema },
      { name: "Transaction", schema: TransactionSchema }
    ])
  ],
  controllers: [BudgetsController],
  providers: [BudgetsService],
})
export class BudgetsModule {}
