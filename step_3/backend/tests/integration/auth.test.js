import request from 'supertest';

import app from '../../src/app.js';

describe('Auth integration', () => {
  test('register with duplicate email returns 400', async () => {
    const payload = {
      name: 'Jane Dev',
      email: 'duplicate@example.com',
      password: 'Password1'
    };

    await request(app).post('/api/v1/auth/register').send(payload).expect(201);

    const response = await request(app).post('/api/v1/auth/register').send(payload).expect(400);
    expect(response.body.success).toBe(false);
  });

  test('login with wrong password returns 401', async () => {
    await request(app).post('/api/v1/auth/register').send({
      name: 'John Dev',
      email: 'john@example.com',
      password: 'Password1'
    });

    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'john@example.com', password: 'WrongPass1' })
      .expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toMatch(/invalid credentials/i);
  });
});
