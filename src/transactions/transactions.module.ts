import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TransactionSchema } from './schema/transaction.schema';
import { JwtAuthGuard } from '../helper/jwt-auth.guard';
import { CategoryModule } from 'src/category/category.module';
import { CategorySchema } from 'src/category/schema/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "Transaction", schema: TransactionSchema },
      { name: "Category", schema: CategorySchema }
    ]),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService]
})
export class TransactionsModule {}
