import { Schema, Document } from "mongoose";
import { Category } from "src/category/schema/category.schema";

export const BudgetSchema = new Schema({
    name: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    amount: { type: Number, required: true },
    startDate: { type: Date, default: Date.now() },
    endDate: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() }
})

export interface Budget extends Document {
    id: string;
    name: string;
    category: Category;
    amount: number;
    startDate: Date;
    endDate?: Date;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
}
