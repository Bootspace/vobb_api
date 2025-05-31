import { Types } from "mongoose";

export interface IUser {
	_id: string;
	name: string;
	email: string;
	password: string;
	isDeleted: boolean;
	phone?: string;
	purchasedCars: Types.ObjectId[];
}

export interface UserMethods {
	verifyPassword(enteredPassword: string): Promise<boolean>;
}
