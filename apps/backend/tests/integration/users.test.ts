import request from 'supertest';
import app from '../../src/app';

describe('User Endpoints', () => {
  let token: string;

  beforeAll(async () => {
    // Login to get token
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'testuser@example.com', password: 'testpass123' });
    token = res.body.token;
    expect(token).toBeDefined();
  });

  it('should get user profile', async () => {
    const res = await request(app)
      .get('/api/v1/users/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe('testuser@example.com');
  });

  it('should update user profile', async () => {
    const res = await request(app)
      .put('/api/v1/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'updated@example.com' });
    expect(res.status).toBe(200);
    expect(res.body.email).toBe('updated@example.com');
  });

  it('should delete user profile', async () => {
    const res = await request(app)
      .delete('/api/v1/users/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204);
  });
});
