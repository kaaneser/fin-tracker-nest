import { Schema, Document } from "mongoose";

export const CategorySchema = new Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    color: { type: String, required: false }
})

export interface Category extends Document {
    id: string;
    name: string;
    type: "income" | "expense";
    userId: string;
}
