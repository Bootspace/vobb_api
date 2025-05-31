import { Request, Response } from 'express';
import { Customer } from '@/models';
import { catchAsync } from '@/middlewares';
import { AppResponse } from '@/common/utils';

export const createCustomer = catchAsync(async (req: Request, res: Response) => {
  const { name, email, phone } = req.body;

  const exists = await Customer.findOne({ email });
  if (exists) return AppResponse(res, 400, null, 'Customer already exists');

  const customer = await Customer.create({ name, email, phone });
  AppResponse(res, 201, customer, 'Customer created successfully');
});

export const getCustomers = catchAsync(async (_req: Request, res: Response) => {
  const customers = await Customer.find();
  AppResponse(res, 200, customers, 'Customers fetched successfully');
});

export const updateCustomer = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  const customer = await Customer.findByIdAndUpdate(id, updates, { new: true });
  if (!customer) return AppResponse(res, 404, null, 'Customer not found');

  AppResponse(res, 200, customer, 'Customer updated successfully');
});

export const deleteCustomer = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const customer = await Customer.findByIdAndDelete(id);
  if (!customer) return AppResponse(res, 404, null, 'Customer not found');

  AppResponse(res, 200, null, 'Customer deleted successfully');
});
