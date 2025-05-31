import mongoose from 'mongoose';
import { ENVIRONMENT } from './environment';

import { ConnectOptions } from 'mongoose';
import { logger } from '../utils';

interface CustomConnectOptions extends ConnectOptions {
	maxPoolSize?: number;
	minPoolSize?: number;
}

export const connectDb = async (): Promise<void> => {
	try {
		const conn = await mongoose.connect(ENVIRONMENT.DB.URL, {} as CustomConnectOptions);

		logger.info('MongoDB Connected to ' + conn.connection.name);
	} catch (error) {
		logger.warn('Error: ' + (error as Error).message);
		process.exit(1);
	}
};

export const disconnectDb = async () => {
	try {
		await mongoose.disconnect();
		logger.alert('MongoDB disconnected');
	} catch (error) {
		logger.alert('Error: ' + (error as Error).message);
		process.exit(1);
	}
};
