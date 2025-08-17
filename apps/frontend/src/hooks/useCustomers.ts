/**
 * Customer Management Hook
 * Centralized customer data management with React Query
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { httpClient } from '../lib/http-client';
import { useToast } from '../components/ui/Toast';
import type { User } from '../types';

interface CustomerFilters {
  search?: string;
  role?: 'customer' | 'admin';
  page?: number;
  limit?: number;
}

interface CreateCustomerData {
  name: string;
  email: string;
  password: string;
  role: 'customer' | 'admin';
}

interface UpdateCustomerData {
  name?: string;
  email?: string;
  password?: string;
  role?: 'customer' | 'admin';
}

// API functions
const customerApi = {
  getAll: async (filters: CustomerFilters = {}): Promise<User[]> => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.role) params.append('role', filters.role);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    
    const response = await httpClient.get<User[]>(`/admin/customers?${params}`);
    return response.data;
  },

  getById: async (id: number): Promise<User> => {
    const response = await httpClient.get<User>(`/admin/customers/${id}`);
    return response.data;
  },

  create: async (data: CreateCustomerData): Promise<User> => {
    const response = await httpClient.post<User>('/admin/customers', data);
    return response.data;
  },

  update: async (id: number, data: UpdateCustomerData): Promise<User> => {
    const response = await httpClient.put<User>(`/admin/customers/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await httpClient.delete(`/admin/customers/${id}`);
  },
};

// Hooks
export function useCustomers(filters: CustomerFilters = {}) {
  return useQuery({
    queryKey: ['customers', filters],
    queryFn: () => customerApi.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCustomer(id: number) {
  return useQuery({
    queryKey: ['customers', id],
    queryFn: () => customerApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: customerApi.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      success('Customer created successfully');
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message || 'Failed to create customer';
      error(message);
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCustomerData }) =>
      customerApi.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customers', data.id] });
      success('Customer updated successfully');
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message || 'Failed to update customer';
      error(message);
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: customerApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      success('Customer deleted successfully');
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message || 'Failed to delete customer';
      error(message);
    },
  });
}
