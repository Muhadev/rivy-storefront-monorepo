import request from 'supertest';
import app from '../../src/app';

describe('Product Endpoints', () => {
  let token: string;
  let adminToken: string;
  let productId: number;
  let createdProductId: number;

  beforeAll(async () => {
    // Login to get regular user token
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'testuser@example.com', password: 'testpass123' });
    token = res.body.token;

    // Login to get admin token
    const adminRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@example.com', password: 'testpass123' });
    adminToken = adminRes.body.token;
  });

  it('should list products', async () => {
    const res = await request(app)
      .get('/api/v1/products')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.products).toBeDefined();
    expect(Array.isArray(res.body.products)).toBe(true);
    expect(res.body.products.length).toBeGreaterThan(0);
    productId = res.body.products[0]?.id;
  });

  it('should get a specific product by ID', async () => {
    const res = await request(app)
      .get(`/api/v1/products/${productId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(productId);
    expect(res.body.name).toBeDefined();
    expect(res.body.price).toBeDefined();
  });

  it('should get product categories', async () => {
    const res = await request(app)
      .get('/api/v1/products/categories')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should create a new product (admin only)', async () => {
    const newProduct = {
      name: 'Test Product',
      price: 99.99,
      description: 'A test product',
      categoryId: 1,
      stock: 10
    };

    const res = await request(app)
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newProduct);
    
    expect(res.status).toBe(201);
    expect(res.body.name).toBe(newProduct.name);
    expect(res.body.price).toBe(newProduct.price);
    createdProductId = res.body.id;
  });

  it('should reject product creation for non-admin users', async () => {
    const newProduct = {
      name: 'Test Product',
      price: 99.99,
      description: 'A test product',
      categoryId: 1,
      stock: 10
    };

    const res = await request(app)
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${token}`)
      .send(newProduct);
    
    expect(res.status).toBe(403);
  });

  it('should update a product (admin only)', async () => {
    const updateData = {
      name: 'Updated Test Product',
      price: 149.99
    };

    const res = await request(app)
      .put(`/api/v1/products/${createdProductId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(updateData);
    
    expect(res.status).toBe(200);
    expect(res.body.name).toBe(updateData.name);
    expect(res.body.price).toBe(updateData.price);
  });

  it('should delete a product (admin only)', async () => {
    const res = await request(app)
      .delete(`/api/v1/products/${createdProductId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    
    expect(res.status).toBe(204);
  });

  it('should reject product deletion for non-admin users', async () => {
    const res = await request(app)
      .delete(`/api/v1/products/${productId}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(403);
  });
});
