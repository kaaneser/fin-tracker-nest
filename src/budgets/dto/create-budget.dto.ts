export class CreateBudgetDto {
    name: string;
    category: string;
    amount: number;
    start_date?: Date;
    end_date?: Date;
    created_at: Date;
    updated_at: Date;
}
