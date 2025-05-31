import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Manager } from '@/models';
import { catchAsync } from '@/middlewares';
import { AppResponse } from '@/common/utils';

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
