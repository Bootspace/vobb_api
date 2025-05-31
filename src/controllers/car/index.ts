import { Request, Response } from 'express';
import { Car } from '@/models';
import { AuthRequest } from '@/middlewares/authmiddleware';
import { catchAsync } from '@/middlewares';
import { AppResponse } from '@/common/utils';

export const createCar = catchAsync(async (req: AuthRequest, res: Response) => {
  const { brand, model, price, year, category } = req.body;

  const car = await Car.create({
    brand,
    model,
    price,
    year,
    category,
    createdBy: req.userId,
  });

  AppResponse(res, 201, car, 'Car created successfully');
});

export const getCars = catchAsync(async (req: Request, res: Response) => {
  const {
    brand,
    model,
    minPrice,
    maxPrice,
    available,
    page = 1,
    limit = 10,
  } = req.query as any;

  const filter: any = {};
  if (brand) filter.brand = brand;
  if (model) filter.model = model;
  if (available !== undefined) filter.available = available === 'true';
  if (minPrice || maxPrice) {
    filter.price = {
      ...(minPrice && { $gte: parseFloat(minPrice) }),
      ...(maxPrice && { $lte: parseFloat(maxPrice) }),
    };
  }

  const cars = await Car.find(filter)
    .skip((+page - 1) * +limit)
    .limit(+limit)
    .populate('category', 'name')
    .populate('createdBy', 'name');

  AppResponse(res, 200, cars, 'Cars fetched successfully');
});

export const updateCar = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  const car = await Car.findByIdAndUpdate(id, updates, { new: true });
  if (!car) return AppResponse(res, 404, null, 'Car not found');

  AppResponse(res, 200, car, 'Car updated successfully');
});

export const deleteCar = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const car = await Car.findByIdAndDelete(id);
  if (!car) return AppResponse(res, 404, null, 'Car not found');

  AppResponse(res, 200, null, 'Car deleted successfully');
});
