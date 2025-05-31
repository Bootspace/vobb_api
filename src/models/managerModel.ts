// src/models/manager.model.ts
import { Schema, model, Document } from 'mongoose';

export interface IManager extends Document {
  name: string;
  email: string;
  password: string;
}

const ManagerSchema = new Schema<IManager>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export const Manager = model<IManager>('Manager', ManagerSchema);
