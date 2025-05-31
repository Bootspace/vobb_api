import { faker } from '@faker-js/faker';
import { Category } from '@/models';
import { catchAsync } from '@/middlewares';
import { AppResponse } from '@/common/utils';
/**
 * Seeding functions
 * This file contains handlers to seed data into the database
 */
export const seedCategories = catchAsync(async (req, res) => {
    const size = Number(req?.query?.size || 20);

    console.log('Seeding categories started ...');

    const categoriesToSeed: unknown[] = [];

    for (let i = 0; i < size; i++) {
        categoriesToSeed.push({
            name: faker.commerce.department(),
            description: faker.commerce.productDescription(),
        });
    }

    // Insert data into MongoDB
    await Category.insertMany(categoriesToSeed);

    console.log('Seeding categories completed ...');

    return AppResponse(res, 200, null, 'Seeders ran successfully');
}
); 