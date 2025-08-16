import request from 'supertest';
import app from '../../src/app';

describe('Review Endpoints', () => {
  let token: string;
  let productId: number;
  let reviewId: number;

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

  it('should list reviews', async () => {
    const res = await request(app)
      .get('/api/v1/reviews')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should create a review', async () => {
    const res = await request(app)
      .post('/api/v1/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId, rating: 5, comment: 'Excellent!' });
    expect(res.status).toBe(201);
    expect(res.body.productId).toBe(productId);
    expect(res.body.rating).toBe(5);
    expect(res.body.comment).toBe('Excellent!');
    reviewId = res.body.id;
  });

  it('should update a review', async () => {
    const updateData = {
      productId,
      rating: 4,
      comment: 'Pretty good!'
    };

    const res = await request(app)
      .put(`/api/v1/reviews/${reviewId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateData);
    
    expect(res.status).toBe(200);
    expect(res.body.rating).toBe(4);
    expect(res.body.comment).toBe('Pretty good!');
  });

  it('should delete a review', async () => {
    const res = await request(app)
      .delete(`/api/v1/reviews/${reviewId}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(204);
  });

  it('should reject review creation with invalid rating', async () => {
    const res = await request(app)
      .post('/api/v1/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId, rating: 6, comment: 'Invalid rating' });
    
    expect(res.status).toBe(400);
  });
});
