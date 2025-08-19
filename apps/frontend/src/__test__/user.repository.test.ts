import { describe, it, expect, vi } from 'vitest';
import { userRepository } from '@/repositories/user.repository';

vi.mock('../lib/api-client', () => ({
  apiClient: {
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  }
}));

describe('UserRepository', () => {
  it('should get profile', async () => {
  const apiClient = require('../lib/api-client').apiClient;
    apiClient.get.mockResolvedValueOnce({ id: 1, name: 'Test User' });
    const user = await userRepository.getProfile();
    expect(user.id).toBe(1);
  });

  it('should update profile', async () => {
  const apiClient = require('../lib/api-client').apiClient;
    apiClient.put.mockResolvedValueOnce({ id: 1, name: 'Updated User' });
    const user = await userRepository.updateProfile({ name: 'Updated User' });
    expect(user.name).toBe('Updated User');
  });
});
