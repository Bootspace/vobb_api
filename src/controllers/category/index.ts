import { Request, Response } from 'express';
import { Category } from '@/models';
import { catchAsync } from '@/middlewares';
import { AppResponse } from '@/common/utils';

export const createCategory = catchAsync(async (req: Request, res: Response) => {
  const { name, description } = req.body;

  const exists = await Category.findOne({ name });
  if (exists) return AppResponse(res, 400, null, 'Category already exists');

  const category = await Category.create({ name, description });
  AppResponse(res, 201, category, 'Category created successfully');
});

export const getCategories = catchAsync(async (_req: Request, res: Response) => {
  const categories = await Category.find();
  AppResponse(res, 200, categories, 'Categories fetched successfully');
});

export const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  const category = await Category.findByIdAndUpdate(id, updates, { new: true });
  if (!category) return AppResponse(res, 404, null, 'Category not found');

  AppResponse(res, 200, category, 'Category updated successfully');
});

export const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const category = await Category.findByIdAndDelete(id);
  if (!category) return AppResponse(res, 404, null, 'Category not found');

  AppResponse(res, 200, null, 'Category deleted successfully');
});
