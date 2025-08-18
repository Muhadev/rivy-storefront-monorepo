import { create } from 'zustand';
import { Order } from '@/types/api';
import { orderRepository, CheckoutData } from '@/repositories/order.repository';

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  fetchOrders: () => Promise<void>;
  fetchOrder: (id: number) => Promise<void>;
  getOrderById: (id: number) => Order | undefined;
  checkout: (data: CheckoutData) => Promise<Order>;
  confirmOrder: (id: number) => Promise<void>;
  cancelOrder: (id: number) => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,

  fetchOrders: async () => {
    set({ isLoading: true });
    try {
      const orders = await orderRepository.getOrders();
      set({ orders, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchOrder: async (id: number) => {
    set({ isLoading: true });
    try {
      const order = await orderRepository.getOrder(id);
      set({ currentOrder: order, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  getOrderById: (id: number) => {
    return get().orders.find(order => order.id === id);
  },

  checkout: async (data: CheckoutData) => {
    set({ isLoading: true });
    try {
      const order = await orderRepository.checkout(data);
      set({ currentOrder: order, isLoading: false });
      // Refresh orders list
      await get().fetchOrders();
      return order;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  confirmOrder: async (id: number) => {
    set({ isLoading: true });
    try {
      await orderRepository.confirmOrder(id);
      // Refresh orders
      await get().fetchOrders();
      if (get().currentOrder?.id === id) {
        await get().fetchOrder(id);
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  cancelOrder: async (id: number) => {
    set({ isLoading: true });
    try {
      await orderRepository.cancelOrder(id);
      // Refresh orders
      await get().fetchOrders();
      if (get().currentOrder?.id === id) {
        await get().fetchOrder(id);
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));
