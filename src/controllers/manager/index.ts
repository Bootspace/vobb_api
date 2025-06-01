import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Manager, Car, Customer, Purchase } from '@/models';
import { AuthRequest, catchAsync } from '@/middlewares';
import { AppError, AppResponse, logger } from '@/common/utils';
import mongoose from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

export const register = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const existing = await Manager.findOne({ email });
  if (existing) {
    return AppResponse(res, 400, null, 'Email already in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const manager = await Manager.create({ name, email, password: hashedPassword });

  AppResponse(res, 201, { id: manager._id, email: manager.email }, 'Registration successful');
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const manager = await Manager.findOne({ email });
  if (!manager) {
    return AppResponse(res, 400, null, 'Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, manager.password);
  if (!isMatch) {
    return AppResponse(res, 400, null, 'Invalid credentials');
  }

  const token = jwt.sign({ id: manager._id }, JWT_SECRET, { expiresIn: '1d' });

  AppResponse(res, 200, { token }, 'Login successful');
});

export const customerPurchase = catchAsync(
  async (req: AuthRequest, res: Response): Promise<any> => {
    const{ managerId } = req.params;
    const { customerId, carId, quantity, totalAmount } = req.body;

    if(!mongoose.Types.ObjectId.isValid(managerId) || !mongoose.Types.ObjectId.isValid(customerId) ||
    !mongoose.Types.ObjectId.isValid(carId)
    ) {
      return new AppError('Incorrect Id', 400);
    };

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const car = await Car.findOneAndUpdate(
        { _id: carId, quantity: { $gt: 0 } },
        { $inc: { quantity: -quantity } },
        { new: true, session }
      );
      if (!car) {
        await session.abortTransaction();
        session.endSession();
        return new AppError('Car not available', 400);
      }

      // Add car to customer's purchase history
      const customer = await Customer.findByIdAndUpdate(
        customerId,
        { $addToSet: { purchasedCars: car._id } },
        { new: true, session }
      );
      if (!customer) {
        await session.abortTransaction();
        session.endSession();
        return new AppError('Customer not found', 404);
      }

      // Create purchase record
      const purchase = await Purchase.create([{
        manager: managerId,
        customer: customerId,
        car: carId,
        quantity,
        totalAmount
      }], { session });

      if (!purchase) {
        await session.abortTransaction();
        session.endSession();
        return new AppError('Purchase creation failed', 500);
      }
      await session.commitTransaction();
      session.endSession();
      logger.info('Purchase successful', { purchaseId: purchase[0]._id });
      return AppResponse(res, 201, purchase[0], 'Purchase successful');

    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      logger.error('Transaction failed', error);
      return new AppError('Transaction failed', 500, error);
    }
  }
);
