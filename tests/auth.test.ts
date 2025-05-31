import request from 'supertest';
import app from '../src/server'; // your Express app
import mongoose from 'mongoose';

beforeAll(async () => {
  // Connect to a test DB
  await mongoose.connect(process.env.DB_URI!);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Auth', () => {
  it('should register a manager', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test Manager',
      email: 'manager@example.com',
      password: 'password123',
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should login a manager', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'manager@example.com',
      password: 'password123',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});
