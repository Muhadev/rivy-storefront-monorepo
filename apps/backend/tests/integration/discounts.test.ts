import request from 'supertest';
import app from '../../src/app';

describe('Discount Endpoints', () => {
  let token: string;
  let discountId: number;

  beforeAll(async () => {
    // Login to get token
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'testuser@example.com', password: 'testpass123' });
    token = res.body.token;
  });

  it('should list discounts', async () => {
    const res = await request(app)
      .get('/api/v1/discounts')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should create a discount', async () => {
    const newDiscount = {
      code: 'TEST10',
      type: 'percentage',
      value: 10,
      isActive: true
    };

    const res = await request(app)
      .post('/api/v1/discounts')
      .set('Authorization', `Bearer ${token}`)
      .send(newDiscount);
    
    expect(res.status).toBe(201);
    expect(res.body.code).toBe(newDiscount.code);
    expect(parseFloat(res.body.value)).toBe(newDiscount.value);
    discountId = res.body.id;
  });

  it('should update a discount', async () => {
    const updateData = {
      value: 15,
      isActive: false
    };

    const res = await request(app)
      .put(`/api/v1/discounts/${discountId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateData);
    
    expect(res.status).toBe(200);
    expect(res.body.code).toBe('TEST10'); // Code should remain unchanged
    expect(parseFloat(res.body.value)).toBe(updateData.value);
    expect(res.body.isActive).toBe(updateData.isActive);
  });

  it('should delete a discount', async () => {
    const res = await request(app)
      .delete(`/api/v1/discounts/${discountId}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(204);
  });

  it('should reject discount creation with invalid percentage', async () => {
    const invalidDiscount = {
      code: 'INVALID',
      percentage: 150, // Invalid percentage > 100
      active: true
    };

    const res = await request(app)
      .post('/api/v1/discounts')
      .set('Authorization', `Bearer ${token}`)
      .send(invalidDiscount);
    
    expect(res.status).toBe(400);
  });
});
