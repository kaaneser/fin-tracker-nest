export class CreateTransactionDto {
    amount: number;
    category: string;
    date?: Date;
    isRecurring?: boolean;
    frequency?: "daily" | "weekly" | "monthly" | "yearly";
    endDate?: Date;
    nextExecDate?: Date;
}
