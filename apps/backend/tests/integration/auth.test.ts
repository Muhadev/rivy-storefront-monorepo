import request from 'supertest';
import app from '../../src/app';

describe('Auth Endpoints', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ 
        email: 'newuser@example.com', 
        password: 'testpass123',
        name: 'New User' 
      });
    expect(res.status).toBe(201);
    expect(res.body.email).toBe('newuser@example.com');
  });

  it('should login with existing user and get JWT', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'testuser@example.com', password: 'testpass123' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
