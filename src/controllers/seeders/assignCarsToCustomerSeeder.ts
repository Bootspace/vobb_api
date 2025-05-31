import { Car, Customer } from '@/models';
import { Types } from 'mongoose';
import { faker } from '@faker-js/faker';
import { catchAsync } from '@/middlewares';
import { AppResponse } from '@/common/utils';

export const assignPurchasedCarsToCustomers = catchAsync(async (req, res) => {
  const customers = await Customer.find();
  const cars = await Car.find();

  const bulkOps = customers.map(customer => {
    const randomCount = faker.number.int({ min: 0, max: 3 });
    const randomCars = faker.helpers.shuffle(cars).slice(0, randomCount);

    return {
      updateOne: {
        filter: { _id: customer._id },
        update: {
          $set: {
            purchasedCars: randomCars.map(car => car._id as Types.ObjectId),
          },
        },
      },
    };
  });

  if (bulkOps.length > 0) {
    await Customer.bulkWrite(bulkOps);
  }

  return AppResponse(res, 200, null, 'Bulk assigned purchased cars to customers');
});
