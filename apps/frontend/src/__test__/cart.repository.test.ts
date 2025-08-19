import { describe, it, expect, vi } from 'vitest';
import { cartRepository } from '@/repositories/cart.repository';

vi.mock('../lib/api-client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  }
}));

describe('CartRepository', () => {
  it('should get cart', async () => {
  const apiClient = require('../lib/api-client').apiClient;
    apiClient.get.mockResolvedValueOnce([]);
    const cart = await cartRepository.getCart();
    expect(cart).toEqual([]);
  });

  it('should add to cart', async () => {
  const apiClient = require('../lib/api-client').apiClient;
    apiClient.post.mockResolvedValueOnce({ productId: 1, quantity: 2 });
    const item = await cartRepository.addToCart({ productId: 1, quantity: 2 });
    expect(item.productId).toBe(1);
  });
});
