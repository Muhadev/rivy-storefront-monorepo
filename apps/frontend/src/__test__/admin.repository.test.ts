import { describe, it, expect, vi } from 'vitest';
import { adminApi } from '@/repositories/admin.repository';

vi.mock('../lib/api-client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  }
}));

describe('AdminRepository', () => {
  it('should get dashboard summary', async () => {
  const apiClient = require('../lib/api-client').apiClient;
    apiClient.get.mockResolvedValue({ data: { products: [], orders: [], reviews: [], discounts: [], users: [] } });
    const summary = await adminApi.getDashboardSummary();
    expect(summary.stats).toBeDefined();
  });

  it('should get customers', async () => {
  const apiClient = require('../lib/api-client').apiClient;
    apiClient.get.mockResolvedValue({ customers: [], pagination: {} });
  const result = await adminApi.getCustomers({ page: 1, limit: 10 }) as { customers: any[]; pagination: any };
  expect(result.customers).toBeDefined();
  });
});
