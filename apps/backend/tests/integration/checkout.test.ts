import request from 'supertest';
import app from '../../src/app';

describe('Checkout Endpoints', () => {
  let token: string;

  beforeAll(async () => {
    // Login to get token
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'testuser@example.com', password: 'testpass123' });
    token = res.body.token;
    expect(token).toBeDefined();
    
    // Get a product and add to cart
    const productsRes = await request(app).get('/api/v1/products');
    const productId = productsRes.body.products[0]?.id;
    await request(app)
      .post('/api/v1/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId, quantity: 1 });
  });

  it('should checkout and create order', async () => {
    const res = await request(app)
      .post('/api/v1/checkout')
      .set('Authorization', `Bearer ${token}`)
      .send({ address: '123 Test St' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('order');
    expect(res.body.order).toHaveProperty('id');
  });
});
