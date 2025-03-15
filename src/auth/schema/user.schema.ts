import { Schema, Document } from "mongoose";

export const UserSchema = new Schema({
    email: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    password: { type: String, required: true }
});

export interface User extends Document {
    id: string;
    email: string;
    name: string;
    password: string;
}
