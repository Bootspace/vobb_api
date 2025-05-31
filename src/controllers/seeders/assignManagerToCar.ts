import { Manager, Car } from "@/models";
import { Types } from 'mongoose';
import { faker } from '@faker-js/faker';
import { catchAsync } from '@/middlewares';
import { AppResponse } from '@/common/utils';

export const assignManagerToCar = catchAsync(async (req, res) => {
  const managers = await Manager.find();
  const cars = await Car.find();

  if (managers.length === 0) {
    return AppResponse(res, 404, null, 'No managers found');
  }

  const bulkOps = cars.map(car => {
    const randomManager = faker.helpers.arrayElement(managers);
    
    return {
      updateOne: {
        filter: { _id: car._id },
        update: {
          $set: {
            createdBy: randomManager._id as Types.ObjectId,
          },
        },
      },
    };
  });

  if (bulkOps.length > 0) {
    await Car.bulkWrite(bulkOps);
  }

  return AppResponse(res, 200, null, 'Bulk assigned managers to cars');
});