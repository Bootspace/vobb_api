import { faker } from '@faker-js/faker';
import { Customer } from '@/models';
import { catchAsync } from '@/middlewares';
import { AppResponse } from '@/common/utils';
/**
 * Seeding functions
 * This file contains handlers to seed data into the database
 */
export const seedCustomers = catchAsync(async (req, res) => {
    const size = Number(req?.query?.size || 20);

    console.log('Seeding customers started ...');

    const customersToSeed: unknown[] = [];

    for (let i = 0; i < size; i++) {
        customersToSeed.push({
            name: faker.person.fullName(),
            email: faker.internet.email(),
            phone: faker.phone.number(),
            purchasedCars: [],
        });
    }

    // Insert data into MongoDB
    await Customer.insertMany(customersToSeed);

    console.log('Seeding customers completed ...');

    return AppResponse(res, 200, null, 'Seeders ran successfully');
}
);