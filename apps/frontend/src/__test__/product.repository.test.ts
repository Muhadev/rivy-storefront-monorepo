import { describe, it, expect, vi } from 'vitest';
import { productRepository } from '@/repositories/product.repository';

vi.mock('../lib/api-client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  }
}));

describe('ProductRepository', () => {
  it('should get products', async () => {
  const apiClient = require('../lib/api-client').apiClient;
    apiClient.get.mockResolvedValueOnce({ products: [], pagination: { total: 0, hasPrevious: false } });
    const result = await productRepository.getProducts();
    expect(result.data).toEqual([]);
  });

  it('should get product by id', async () => {
  const apiClient = require('../lib/api-client').apiClient;
    apiClient.get.mockResolvedValueOnce({ data: { id: 1 } });
    const product = await productRepository.getProduct(1);
    expect(product.id).toBe(1);
  });
});
