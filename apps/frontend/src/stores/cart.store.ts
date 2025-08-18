import { create } from 'zustand';
import { CartItem } from '@/types/api';
import { cartRepository } from '@/repositories/cart.repository';
import { useAuthStore } from './auth.store';

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateCartItem: (productId: number, quantity: number) => Promise<void>;
  removeCartItem: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,

  fetchCart: async () => {
    // Only fetch cart if user is authenticated
    const authStore = useAuthStore.getState();
    if (!authStore.isAuthenticated || !authStore.token) {
      set({ items: [], isLoading: false });
      return;
    }

    set({ isLoading: true });
    try {
      const items = await cartRepository.getCart();
      set({ items, isLoading: false });
    } catch (error) {
      set({ items: [], isLoading: false });
      // Don't throw error if user is not authenticated
      if (error instanceof Error && !error.message.includes('token')) {
        throw error;
      }
    }
  },

  addToCart: async (productId: number, quantity: number) => {
    const authStore = useAuthStore.getState();
    if (!authStore.isAuthenticated || !authStore.token) {
      throw new Error('Please login to add items to cart');
    }

    set({ isLoading: true });
    try {
      await cartRepository.addToCart({ productId, quantity });
      await get().fetchCart();
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateCartItem: async (productId: number, quantity: number) => {
    set({ isLoading: true });
    try {
      await cartRepository.updateCartItem(productId, { quantity });
      await get().fetchCart();
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  removeCartItem: async (productId: number) => {
    set({ isLoading: true });
    try {
      await cartRepository.removeCartItem(productId);
      await get().fetchCart();
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  clearCart: async () => {
    set({ isLoading: true });
    try {
      await cartRepository.clearCart();
      set({ items: [], isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));

// Helper functions for computed properties
export const useCartTotalItems = () => {
  return useCartStore((state) => 
    state.items.reduce((total, item) => total + item.quantity, 0)
  );
};

export const useCartTotalPrice = () => {
  return useCartStore((state) => 
    state.items.reduce((total, item) => {
      const price = item.product?.price || 0;
      return total + (price * item.quantity);
    }, 0)
  );
};