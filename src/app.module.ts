import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TransactionsModule } from './transactions/transactions.module';
import { CategoryModule } from './category/category.module';
import { BudgetsModule } from './budgets/budgets.module';

@Module({
  imports: [
    MongooseModule.forRoot("mongodb://localhost/fin-tracker-db"),
    AuthModule,
    TransactionsModule,
    CategoryModule,
    BudgetsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
