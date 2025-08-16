import request from 'supertest';
import app from '../../src/app';

describe('Cart Endpoints', () => {
  let token: string;
  let productId: number;

  beforeAll(async () => {
    // Login to get token
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'testuser@example.com', password: 'testpass123' });
    token = res.body.token;
    // Get a product
    const prodRes = await request(app)
      .get('/api/v1/products')
      .set('Authorization', `Bearer ${token}`);
    productId = prodRes.body.products[0]?.id;
  });

  it('should add product to cart', async () => {
    const res = await request(app)
      .post('/api/v1/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId, quantity: 1 });
    expect(res.status).toBe(201);
    expect(res.body.productId).toBe(productId);
  });
});
