import { describe, it, expect, vi } from 'vitest';
import { discountRepository } from '@/repositories/discount.repository';

vi.mock('../lib/api-client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  }
}));

describe('DiscountRepository', () => {
  it('should get discounts', async () => {
  const apiClient = require('../lib/api-client').apiClient;
    apiClient.get.mockResolvedValueOnce([]);
    const discounts = await discountRepository.getDiscounts();
    expect(discounts).toEqual([]);
  });

  it('should apply discount', async () => {
  const apiClient = require('../lib/api-client').apiClient;
    apiClient.post.mockResolvedValueOnce({ discount: { id: 1 }, amount: 10 });
    const result = await discountRepository.applyDiscount({ code: 'SAVE10', orderAmount: 100 });
    expect(result.amount).toBe(10);
  });
});
