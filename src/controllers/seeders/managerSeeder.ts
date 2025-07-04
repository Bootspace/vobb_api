import { faker } from '@faker-js/faker';
import { Manager } from '@/models';
import { catchAsync } from '@/middlewares';
import { AppResponse } from '@/common/utils';

/**
 * Seeding functions
 * This file contains handlers to seed data into the database
 */

export const seedUsers = catchAsync(async (req, res) => {
	const size = Number(req?.query?.size || 20);

	console.log('Seeding users started ...');

	const usersToSeed: unknown[] = [];

	for (let i = 0; i < size; i++) {
		usersToSeed.push({
			name: faker.person.fullName(),
			email: faker.internet.email(),
			password: faker.internet.password(),
		});
	}

	// Insert data into MongoDB
	await Manager.insertMany(usersToSeed);

	console.log('Seeding users completed ...');

	return AppResponse(res, 200, null, 'Seeders ran successfully');
});
