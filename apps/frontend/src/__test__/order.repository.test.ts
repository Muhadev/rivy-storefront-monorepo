import { describe, it, expect, vi } from 'vitest';
import { orderRepository } from '@/repositories/order.repository';

// Mock apiClient
vi.mock('../lib/api-client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  }
}));

describe('OrderRepository', () => {
  it('should fetch orders', async () => {
    const mockOrders = [{ id: 1, status: 'pending' }];
  const apiClient = require('../lib/api-client').apiClient;
    apiClient.get.mockResolvedValueOnce(mockOrders);
    const orders = await orderRepository.getOrders();
    expect(orders).toEqual(mockOrders);
  });

  it('should fetch order by id', async () => {
    const mockOrder = { id: 1, status: 'pending' };
  const apiClient = require('../lib/api-client').apiClient;
    apiClient.get.mockResolvedValueOnce(mockOrder);
    const order = await orderRepository.getOrder(1);
    expect(order).toEqual(mockOrder);
  });

  it('should confirm order', async () => {
    const mockResponse = { id: 1, status: 'confirmed' };
  const apiClient = require('../lib/api-client').apiClient;
    apiClient.post.mockResolvedValueOnce(mockResponse);
    const result = await orderRepository.confirmOrder(1);
    expect(result).toEqual(mockResponse);
  });

  it('should cancel order', async () => {
    const mockResponse = { id: 1, status: 'cancelled' };
  const apiClient = require('../lib/api-client').apiClient;
    apiClient.post.mockResolvedValueOnce(mockResponse);
    const result = await orderRepository.cancelOrder(1);
    expect(result).toEqual(mockResponse);
  });

  it('should checkout', async () => {
    const mockOrder = { id: 1, status: 'pending' };
  const apiClient = require('../lib/api-client').apiClient;
    apiClient.post.mockResolvedValueOnce(mockOrder);
    const order = await orderRepository.checkout({ address: '123 Main St' });
    expect(order).toEqual(mockOrder);
  });
});
