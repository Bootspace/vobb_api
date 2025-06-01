// src/models/car.model.ts
import { Schema, model, Document, Types } from 'mongoose';

export interface ICar extends Document {
  brand: string;
  car_model: string;
  price: number;
  year: number;
  available: boolean;
  quantity: number;
  category: Types.ObjectId;
  createdBy: Types.ObjectId;
  createdAt: Date;
}

const CarSchema = new Schema<ICar>({
  brand: { type: String, required: true },
  car_model: { type: String, required: true },
  price: { type: Number, required: true },
  year: { type: Number, required: true },
  available: { type: Boolean, default: true },
  quantity: { type: Number, required: true, default: 0 },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'Manager', required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Car = model<ICar>('Car', CarSchema);
