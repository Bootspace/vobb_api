import { Category, Car } from "@/models";
import { Types } from 'mongoose';
import { faker } from '@faker-js/faker';
import { catchAsync } from '@/middlewares';
import { AppResponse } from '@/common/utils';

export const assignCategoryToCars = catchAsync(async (req, res) => {
  const categories = await Category.find();
  const cars = await Car.find();

  if (categories.length === 0) {
    return AppResponse(res, 404, null, 'No categories found');
  }

  const bulkOps = cars.map(car => {
    const randomCategory = faker.helpers.arrayElement(categories);
    
    return {
      updateOne: {
        filter: { _id: car._id },
        update: {
          $set: {
            category: randomCategory._id as Types.ObjectId,
          },
        },
      },
    };
  });

  if (bulkOps.length > 0) {
    await Car.bulkWrite(bulkOps);
  }

  return AppResponse(res, 200, null, 'Bulk assigned categories to cars');
});