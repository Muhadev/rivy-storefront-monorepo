import { apiClient } from '@/lib/api-client';
import { ENDPOINTS } from '@/config/api';
import { Order } from '@/types/api';

export interface CheckoutData {
  address: string;
}

export class OrderRepository {
  async getOrders(): Promise<Order[]> {
    // Backend returns orders directly as an array
    return await apiClient.get<Order[]>(ENDPOINTS.ORDERS.LIST);
  }

  async getOrder(id: number): Promise<Order> {
    // Backend returns order directly
    return await apiClient.get<Order>(ENDPOINTS.ORDERS.DETAIL(id));
  }

  async confirmOrder(id: number): Promise<{ id: number; status: string }> {
    // Backend returns simplified response for confirm
    return await apiClient.post<{ id: number; status: string }>(
      ENDPOINTS.ORDERS.CONFIRM(id),
      {}
    );
  }

  async cancelOrder(id: number): Promise<{ id: number; status: string }> {
    // Backend returns simplified response for cancel
    return await apiClient.post<{ id: number; status: string }>(
      ENDPOINTS.ORDERS.CANCEL(id),
      {}
    );
  }

  async checkout(data: CheckoutData): Promise<Order> {
    // Backend returns order directly from checkout
    return await apiClient.post<Order>(ENDPOINTS.CHECKOUT, data);
  }
}

export const orderRepository = new OrderRepository();