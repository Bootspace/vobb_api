import { Schema, model, Document, Types } from 'mongoose';

export interface ICustomer extends Document {
  name: string;
  email: string;
  phone?: string;
  purchasedCars: Types.ObjectId[];
}

const CustomerSchema = new Schema<ICustomer>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  purchasedCars: [{ type: Schema.Types.ObjectId, ref: 'Car' }],
});

export const Customer = model<ICustomer>('Customer', CustomerSchema);
