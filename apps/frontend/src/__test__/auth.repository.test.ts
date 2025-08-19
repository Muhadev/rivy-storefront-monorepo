import { describe, it, expect, vi } from 'vitest';
import { authRepository } from '@/repositories/auth.repository';

vi.mock('../lib/api-client', () => ({
  apiClient: {
    post: vi.fn(),
  }
}));

describe('AuthRepository', () => {
  it('should register a user', async () => {
  const apiClient = require('../lib/api-client').apiClient;
    apiClient.post.mockResolvedValueOnce({ token: 'abc', user: { id: 1 } });
    const result = await authRepository.register({ email: 'test@test.com', password: 'pass', name: 'Test' });
    expect(result.token).toBe('abc');
  });

  it('should login a user', async () => {
  const apiClient = require('../lib/api-client').apiClient;
    apiClient.post.mockResolvedValueOnce({ token: 'abc', user: { id: 1 } });
    const result = await authRepository.login({ email: 'test@test.com', password: 'pass' });
    expect(result.token).toBe('abc');
  });
});
