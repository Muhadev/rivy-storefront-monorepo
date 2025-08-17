/**
 * Order Management Hooks
 * Custom hooks for order CRUD operations with React Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderRepository } from '../lib/repositories';
import type { Order, OrderFilters, CreateOrderData, UpdateOrderData } from '../types';
import { useToast } from '../components/ui/Toast';

// Query keys for React Query
export const orderQueryKeys = {
  all: ['orders'] as const,
  lists: () => [...orderQueryKeys.all, 'list'] as const,
  list: (filters: OrderFilters) => [...orderQueryKeys.lists(), filters] as const,
  details: () => [...orderQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...orderQueryKeys.details(), id] as const,
  userOrders: () => [...orderQueryKeys.all, 'user'] as const,
  stats: () => [...orderQueryKeys.all, 'stats'] as const,
};

// Get all orders with filters
export function useOrders(filters?: OrderFilters) {
  return useQuery({
    queryKey: orderQueryKeys.list(filters || {}),
    queryFn: () => orderRepository.getAll(filters),
    staleTime: 30 * 1000, // 30 seconds
  });
}

// Get single order
export function useOrder(id: number) {
  return useQuery({
    queryKey: orderQueryKeys.detail(id),
    queryFn: () => orderRepository.getById(id),
    enabled: !!id,
    staleTime: 60 * 1000, // 1 minute
  });
}

// Get user's orders
export function useUserOrders() {
  return useQuery({
    queryKey: orderQueryKeys.userOrders(),
    queryFn: () => orderRepository.getUserOrders(),
    staleTime: 60 * 1000, // 1 minute
  });
}

// Get orders by status
export function useOrdersByStatus(status: string) {
  return useQuery({
    queryKey: orderQueryKeys.list({ status }),
    queryFn: () => orderRepository.getOrdersByStatus(status),
    enabled: !!status,
    staleTime: 30 * 1000, // 30 seconds
  });
}

// Create order mutation
export function useCreateOrder() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (data: CreateOrderData) => orderRepository.create(data),
    onSuccess: (newOrder) => {
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.userOrders() });
      success('Order created successfully!');
    },
    onError: (err: any) => {
      error(err.message || 'Failed to create order');
    },
  });
}

// Update order mutation
export function useUpdateOrder() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateOrderData }) => 
      orderRepository.update(id, data),
    onSuccess: (updatedOrder, variables) => {
      queryClient.setQueryData(
        orderQueryKeys.detail(variables.id),
        updatedOrder
      );
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.lists() });
      success('Order updated successfully!');
    },
    onError: (err: any) => {
      error(err.message || 'Failed to update order');
    },
  });
}

// Confirm order mutation
export function useConfirmOrder() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (id: number) => orderRepository.confirm(id),
    onSuccess: (confirmedOrder, orderId) => {
      queryClient.setQueryData(
        orderQueryKeys.detail(orderId),
        confirmedOrder
      );
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.lists() });
      success('Order confirmed successfully!');
    },
    onError: (err: any) => {
      error(err.message || 'Failed to confirm order');
    },
  });
}

// Delete order mutation
export function useDeleteOrder() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (id: number) => orderRepository.delete(id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: orderQueryKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.lists() });
      success('Order deleted successfully!');
    },
    onError: (err: any) => {
      error(err.message || 'Failed to delete order');
    },
  });
}
