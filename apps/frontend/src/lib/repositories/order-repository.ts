/**
 * Order Repository
 * Handles all order-related API operations
 */

import { BaseRepository } from './base-repository';
import type { Order, CreateOrderData, UpdateOrderData, OrderFilters } from '../../types';

class OrderRepository extends BaseRepository<Order, CreateOrderData, UpdateOrderData> {
  private endpoint = '/orders';

  constructor() {
    super({
      baseEndpoint: '/orders',
    });
  }

  async getAll(filters?: OrderFilters) {
    return this.request<Order[]>('get', '', undefined, { params: filters });
  }

  async getById(id: number) {
    return this.request<Order>('get', `/${id}`);
  }

  async create(data: CreateOrderData) {
    return this.request<Order>('post', '', data);
  }

  async update(id: number, data: UpdateOrderData) {
    return this.request<Order>('put', `/${id}`, data);
  }

  async delete(id: number): Promise<void> {
    return this.request<void>('delete', `/${id}`);
  }

  async confirm(id: number) {
    return this.request<Order>('post', `/${id}/confirm`);
  }

  async getUserOrders() {
    return this.request<Order[]>('get', '/user/me');
  }

  async getOrdersByStatus(status: string) {
    return this.request<Order[]>('get', '', undefined, { params: { status } });
  }
}

export const orderRepository = new OrderRepository();
export type { CreateOrderData, UpdateOrderData };
