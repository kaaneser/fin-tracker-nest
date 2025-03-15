import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema } from './schema/category.schema';
import { TransactionSchema } from 'src/transactions/schema/transaction.schema';
import { TransactionsModule } from 'src/transactions/transactions.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "Category", schema: CategorySchema },
      { name: "Transaction", schema: TransactionSchema }
    ]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [MongooseModule]
})
export class CategoryModule {}
