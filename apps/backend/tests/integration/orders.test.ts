import request from 'supertest';
import app from '../../src/app';

describe('Order Endpoints', () => {
  let token: string;
  let orderId: number;
  let productId: number;

  beforeAll(async () => {
    // Login to get token
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'testuser@example.com', password: 'testpass123' });
    token = res.body.token;
    expect(token).toBeDefined();
    
    // Get a product and add to cart
    const productsRes = await request(app).get('/api/v1/products');
    productId = productsRes.body.products[0]?.id;
    await request(app)
      .post('/api/v1/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId, quantity: 1 });
    
    // Create an order via checkout
    const checkoutRes = await request(app)
      .post('/api/v1/checkout')
      .set('Authorization', `Bearer ${token}`)
      .send({ address: '123 Test St' });
    orderId = checkoutRes.body.order.id;
  });

  it('should get user orders', async () => {
    const res = await request(app)
      .get('/api/v1/orders/user/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get specific order by ID', async () => {
    const res = await request(app)
      .get(`/api/v1/orders/${orderId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(orderId);
    expect(res.body.status).toBeDefined();
  });

  it('should create a new order directly', async () => {
    // Add item to cart first
    await request(app)
      .post('/api/v1/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId, quantity: 2 });

    const newOrder = {
      address: '456 Direct Order St',
      items: [
        {
          productId: productId,
          quantity: 2
        }
      ]
    };

    const res = await request(app)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${token}`)
      .send(newOrder);
    
    expect(res.status).toBe(201);
    expect(res.body.address).toBe(newOrder.address);
    expect(res.body.status).toBe('pending');
  });

  it('should update an order', async () => {
    const updateData = {
      address: '789 Updated St',
      status: 'processing'
    };

    const res = await request(app)
      .put(`/api/v1/orders/${orderId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateData);
    
    expect(res.status).toBe(200);
    expect(res.body.address).toBe(updateData.address);
  });

  it('should confirm the order', async () => {
    const res = await request(app)
      .post(`/api/v1/orders/${orderId}/confirm`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.status).toBeDefined();
  });

  it('should delete an order', async () => {
    // Create a new order to delete
    await request(app)
      .post('/api/v1/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId, quantity: 1 });

    const orderRes = await request(app)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ 
        address: '999 Delete St',
        items: [
          {
            productId: productId,
            quantity: 1
          }
        ]
      });

    const deleteRes = await request(app)
      .delete(`/api/v1/orders/${orderRes.body.id}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(deleteRes.status).toBe(204);
  });

  it('should reject order creation with empty cart', async () => {
    // Clear cart first
    await request(app)
      .delete('/api/v1/cart/clear')
      .set('Authorization', `Bearer ${token}`);

    const res = await request(app)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ 
        address: 'Empty Cart St',
        items: [] // Empty items should be rejected
      });
    
    expect(res.status).toBe(400);
  });
});
