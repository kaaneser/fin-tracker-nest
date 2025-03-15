import { Schema, Document } from "mongoose";
import { Category } from "src/category/schema/category.schema";

export const TransactionSchema = new Schema({
    amount: { type: Number, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    date: { type: Date, default: Date.now() },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }
});

export interface Transaction extends Document {
    id: string;
    amount: number;
    category: Category | string;
    date: Date;
    userId: string;
}
