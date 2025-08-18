import { create } from 'zustand';
import { Discount, ApplyDiscountData, DiscountResult } from '@/repositories/discount.repository';
import { discountRepository } from '@/repositories/discount.repository';

interface DiscountState {
  discounts: Discount[];
  appliedDiscount: DiscountResult | null;
  isLoading: boolean;
  fetchDiscounts: () => Promise<void>;
  applyDiscount: (data: ApplyDiscountData) => Promise<DiscountResult>;
  removeDiscount: () => void;
  validateDiscount: (code: string) => Promise<Discount>;
  setLoading: (loading: boolean) => void;
}

export const useDiscountStore = create<DiscountState>((set) => ({
  discounts: [],
  appliedDiscount: null,
  isLoading: false,

  fetchDiscounts: async () => {
    set({ isLoading: true });
    try {
      const discounts = await discountRepository.getDiscounts();
      set({ discounts, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  applyDiscount: async (data: ApplyDiscountData) => {
    set({ isLoading: true });
    try {
      const result = await discountRepository.applyDiscount(data);
      set({ appliedDiscount: result, isLoading: false });
      return result;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  removeDiscount: () => {
    set({ appliedDiscount: null });
  },

  validateDiscount: async (code: string) => {
    set({ isLoading: true });
    try {
      const discount = await discountRepository.validateDiscount(code);
      set({ isLoading: false });
      return discount;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));
