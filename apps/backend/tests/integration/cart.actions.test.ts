import request from 'supertest';
import app from '../../src/app';

describe('Cart Actions Endpoints', () => {
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
    // Add to cart
    await request(app)
      .post('/api/v1/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId, quantity: 1 });
  });

  it('should update cart item quantity', async () => {
    const res = await request(app)
      .patch(`/api/v1/cart/items/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ quantity: 3 });
    expect(res.status).toBe(200);
    expect(res.body.quantity).toBe(3);
  });

  it('should remove cart item', async () => {
    const res = await request(app)
      .delete(`/api/v1/cart/items/${productId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it('should clear cart', async () => {
    // Add again for clear test
    await request(app)
      .post('/api/v1/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId, quantity: 1 });
    const res = await request(app)
      .delete('/api/v1/cart/clear')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204);
  });
});
