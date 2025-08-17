/**
 * Discount hooks for data fetching and mutations
 * React Query integration for discount management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import type { Discount } from '../types';
import { useToast } from '../components/ui/Toast';

// Create discount data interface
interface CreateDiscountData {
  code: string;
  description?: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount?: number;
  maxUses?: number;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}

// Update discount data interface
interface UpdateDiscountData {
  description?: string;
  type?: 'percentage' | 'fixed';
  value?: number;
  minOrderAmount?: number;
  maxUses?: number;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}

// Query parameters for listing discounts
interface DiscountQuery {
  type?: 'percentage' | 'fixed';
  isActive?: boolean;
  page?: number;
  limit?: number;
}

/**
 * Fetch all discounts with optional filtering
 */
export function useDiscounts(query: DiscountQuery = {}) {
  return useQuery({
    queryKey: ['discounts', query],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (query.type) params.append('type', query.type);
      if (query.isActive !== undefined) params.append('isActive', query.isActive.toString());
      if (query.page) params.append('page', query.page.toString());
      if (query.limit) params.append('limit', query.limit.toString());
      
      const url = params.toString() ? `/discounts?${params}` : '/discounts';
      const response = await api.get<Discount[]>(url);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch a single discount by ID
 */
export function useDiscount(id: number | string) {
  return useQuery({
    queryKey: ['discount', id],
    queryFn: async () => {
      const response = await api.get<Discount>(`/discounts/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Create a new discount
 */
export function useCreateDiscount() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async (data: CreateDiscountData) => {
      const response = await api.post<Discount>('/discounts', data);
      return response.data;
    },
    onSuccess: (newDiscount) => {
      // Invalidate and refetch discounts list
      queryClient.invalidateQueries({ queryKey: ['discounts'] });
      
      // Add the new discount to the cache
      queryClient.setQueryData(['discount', newDiscount.id], newDiscount);
      
      toast.success(`Discount code "${newDiscount.code}" created successfully`);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create discount';
      toast.error(message);
    },
  });
}

/**
 * Update an existing discount
 */
export function useUpdateDiscount() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateDiscountData }) => {
      const response = await api.put<Discount>(`/discounts/${id}`, data);
      return response.data;
    },
    onSuccess: (updatedDiscount) => {
      // Update the specific discount in cache
      queryClient.setQueryData(['discount', updatedDiscount.id], updatedDiscount);
      
      // Invalidate discounts list to refetch
      queryClient.invalidateQueries({ queryKey: ['discounts'] });
      
      toast.success(`Discount code "${updatedDiscount.code}" updated successfully`);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update discount';
      toast.error(message);
    },
  });
}

/**
 * Delete a discount
 */
export function useDeleteDiscount() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/discounts/${id}`);
      return id;
    },
    onSuccess: (deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: ['discount', deletedId] });
      
      // Invalidate discounts list
      queryClient.invalidateQueries({ queryKey: ['discounts'] });
      
      toast.success('Discount deleted successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete discount';
      toast.error(message);
    },
  });
}

/**
 * Validate a discount code for use in checkout
 */
export function useValidateDiscount() {
  const toast = useToast();

  return useMutation({
    mutationFn: async ({ code, orderAmount }: { code: string; orderAmount?: number }) => {
      const response = await api.post<{ discount: Discount; discountAmount: number }>('/discounts/validate', {
        code,
        orderAmount,
      });
      return response.data;
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Invalid discount code';
      toast.error(message);
    },
  });
}

/**
 * Helper functions for discount calculations and formatting
 */
export const discountUtils = {
  /**
   * Calculate discount amount based on type and value
   */
  calculateAmount: (discount: Discount, orderAmount: number): number => {
    if (discount.type === 'percentage') {
      return (orderAmount * discount.value) / 100;
    } else {
      return Math.min(discount.value, orderAmount);
    }
  },

  /**
   * Format discount value for display
   */
  formatValue: (discount: Discount): string => {
    if (discount.type === 'percentage') {
      return `${discount.value}%`;
    } else {
      return `$${discount.value.toFixed(2)}`;
    }
  },

  /**
   * Check if discount is currently valid (date-wise)
   */
  isDateValid: (discount: Discount): boolean => {
    const now = new Date();
    
    if (discount.startDate && now < new Date(discount.startDate)) {
      return false;
    }
    
    if (discount.endDate && now > new Date(discount.endDate)) {
      return false;
    }
    
    return true;
  },

  /**
   * Check if discount has usage remaining
   */
  hasUsageRemaining: (discount: Discount): boolean => {
    if (!discount.maxUses) return true;
    return discount.usedCount < discount.maxUses;
  },

  /**
   * Get discount status text
   */
  getStatus: (discount: Discount): string => {
    if (!discount.isActive) return 'Inactive';
    if (!discountUtils.isDateValid(discount)) return 'Expired';
    if (!discountUtils.hasUsageRemaining(discount)) return 'Usage Limit Reached';
    return 'Active';
  },

  /**
   * Get status color for badges
   */
  getStatusColor: (discount: Discount): 'success' | 'warning' | 'error' | 'neutral' => {
    const status = discountUtils.getStatus(discount);
    switch (status) {
      case 'Active': return 'success';
      case 'Expired': return 'error';
      case 'Usage Limit Reached': return 'warning';
      case 'Inactive': return 'neutral';
      default: return 'neutral';
    }
  }
};
