import { faker } from '@faker-js/faker';
import { Car } from '@/models';
import { catchAsync } from '@/middlewares';
import { AppResponse } from '@/common/utils';
/**
 * Seeding functions
 * This file contains handlers to seed data into the database
 */
export const seedCars = catchAsync(async (req, res) => {    
    const size = Number(req?.query?.size || 20);

    console.log('Seeding cars started ...');

    const carsToSeed: unknown[] = [];

    for (let i = 0; i < size; i++) {
        carsToSeed.push({
            brand: faker.vehicle.manufacturer(),
            car_model: faker.vehicle.model(),
            price: faker.number.int({ min: 10000, max: 50000 }),
            year: faker.number.int({ min: 2000, max: 2023 }),
            available: faker.datatype.boolean(),
            category: null, // Assuming category will be set later
            createdBy: null, // Assuming createdBy will be set later
        });
    }

    // Insert data into MongoDB
    await Car.insertMany(carsToSeed);

    console.log('Seeding cars completed ...');

    return AppResponse(res, 200, null, 'Seeders ran successfully');
})