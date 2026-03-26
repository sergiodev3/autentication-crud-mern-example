import request from 'supertest';

import app from '../../src/app.js';

const registerAndLogin = async ({ name, email, password }) => {
  await request(app).post('/api/v1/auth/register').send({ name, email, password }).expect(201);

  const login = await request(app)
    .post('/api/v1/auth/login')
    .send({ email, password })
    .expect(200);

  return login.body.data.token;
};

describe('Products integration', () => {
  test('products route without token returns 401', async () => {
    const response = await request(app).get('/api/v1/products').expect(401);
    expect(response.body.success).toBe(false);
  });

  test('create product with missing fields returns 422', async () => {
    const token = await registerAndLogin({
      name: 'Ana',
      email: 'ana@example.com',
      password: 'Password1'
    });

    const response = await request(app)
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Mouse' })
      .expect(422);

    expect(response.body.success).toBe(false);
  });

  test('delete product from another user returns 403', async () => {
    const ownerToken = await registerAndLogin({
      name: 'Owner',
      email: 'owner@example.com',
      password: 'Password1'
    });

    const intruderToken = await registerAndLogin({
      name: 'Intruder',
      email: 'intruder@example.com',
      password: 'Password1'
    });

    const created = await request(app)
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        name: 'Gaming Mouse',
        description: 'RGB mouse with 6 buttons',
        price: 45.5,
        stock: 5
      })
      .expect(201);

    const productId = created.body.data._id;

    const response = await request(app)
      .delete(`/api/v1/products/${productId}`)
      .set('Authorization', `Bearer ${intruderToken}`)
      .expect(403);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toMatch(/not allowed/i);
  });
});
