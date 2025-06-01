import { Schema, model, Document, Types } from 'mongoose';

export interface IPurchase extends Document {
    manager: Types.ObjectId;
    customer: Types.ObjectId;
    car: Types.ObjectId;
    totalPrice: number;
    quantity: number;
};

const PurchaseSchema = new Schema<IPurchase>({
    manager: {
        type: Schema.Types.ObjectId,
        ref: 'Manager',
        required: true
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    car: {
        type: Schema.Types.ObjectId,
        ref: 'Car',
        required: true
    },
    quantity: { type: Number, required: true, default: 0 },
    totalPrice: { type: Number, required: true, default: 0 },
});

export const Purchase = model<IPurchase>('Purchase', PurchaseSchema);