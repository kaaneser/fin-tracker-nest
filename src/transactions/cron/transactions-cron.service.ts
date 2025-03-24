import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from '../schema/transaction.schema';
import { calculateNextExecDate } from 'src/utils/calculateNextExecDate';

@Injectable()
export class TransactionCronService {
    private readonly logger = new Logger(TransactionCronService.name);

    constructor(
        @InjectModel("Transaction") private transactionModel: Model<Transaction>
    ) {}

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async handleRecurringTransactions() {
        this.logger.log("Checking recurring transactions...");

        const now = new Date();

        const transactions = await this.transactionModel.find({
            isRecurring: true,
            nextExecDate: { $lte: now },
        });

        if (transactions.length === 0) {
            this.logger.log("No recurring transactions found");
            return;
        }

        this.logger.log(`Processing ${transactions.length} recurring transactions...`);

        for (const transaction of transactions) {
            const newTransaction = new this.transactionModel({
                ...transaction.toObject(),
                _id: undefined,
                date: new Date(),
                isRecurring: false
            });


            await newTransaction.save();

            transaction.nextExecDate = await calculateNextExecDate(transaction.nextExecDate!, transaction.frequency!);
            await transaction.save();
        }
    }
}