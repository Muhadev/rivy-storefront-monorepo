import request from 'supertest';
import app from '../../src/app';

describe('Cart and Checkout Integration', () => {
  let productId: number;
  let orderId: number;
  let token: string;

  beforeAll(async () => {
    // Login to get token
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'testuser@example.com', password: 'testpass123' });
    token = res.body.token;
  });

  it('should list products and add one to cart', async () => {
    const productsRes = await request(app).get('/api/v1/products').expect(200);
    expect(productsRes.body.products).toBeDefined();
    expect(Array.isArray(productsRes.body.products)).toBe(true);
    productId = productsRes.body.products[0]?.id;
    expect(productId).toBeDefined();

    const addRes = await request(app)
      .post('/api/v1/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId, quantity: 1 })
      .expect(201);
    expect(addRes.body).toHaveProperty('productId', productId);
  });

  it('should perform checkout and create an order', async () => {
    const checkoutRes = await request(app)
      .post('/api/v1/checkout')
      .set('Authorization', `Bearer ${token}`)
      .send({ address: '123 Test St' })
      .expect(201);
    expect(checkoutRes.body).toHaveProperty('order');
    expect(checkoutRes.body.order).toHaveProperty('id');
    orderId = checkoutRes.body.order.id;
  });

  it('should confirm the order', async () => {
    const confirmRes = await request(app)
      .post(`/api/v1/orders/${orderId}/confirm`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(confirmRes.body).toHaveProperty('status', 'processing');
  });
});
