/**
 * Product Management Hooks
 * Custom hooks for product CRUD operations with React Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productRepository } from '../lib/repositories';
import type { Product, ProductFilters, CreateProductData, UpdateProductData } from '../types';
import { useToast } from '../components/ui/Toast';

// Query keys for React Query
export const productQueryKeys = {
  all: ['products'] as const,
  lists: () => [...productQueryKeys.all, 'list'] as const,
  list: (filters: ProductFilters) => [...productQueryKeys.lists(), filters] as const,
  details: () => [...productQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...productQueryKeys.details(), id] as const,
};

// Get all products with filters
export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: productQueryKeys.list(filters || {}),
    queryFn: () => productRepository.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get single product
export function useProduct(id: number) {
  return useQuery({
    queryKey: productQueryKeys.detail(id),
    queryFn: () => productRepository.getById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Create product mutation
export function useCreateProduct() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (data: CreateProductData) => productRepository.create(data),
    onSuccess: (newProduct) => {
      // Invalidate and refetch products
      queryClient.invalidateQueries({ queryKey: productQueryKeys.lists() });
      success('Product created successfully!');
    },
    onError: (err: any) => {
      error(err.message || 'Failed to create product');
    },
  });
}

// Update product mutation
export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProductData }) => 
      productRepository.update(id, data),
    onSuccess: (updatedProduct, variables) => {
      // Update the product in cache
      queryClient.setQueryData(
        productQueryKeys.detail(variables.id),
        updatedProduct
      );
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: productQueryKeys.lists() });
      success('Product updated successfully!');
    },
    onError: (err: any) => {
      error(err.message || 'Failed to update product');
    },
  });
}

// Delete product mutation
export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (id: number) => productRepository.delete(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: productQueryKeys.detail(deletedId) });
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: productQueryKeys.lists() });
      success('Product deleted successfully!');
    },
    onError: (err: any) => {
      error(err.message || 'Failed to delete product');
    },
  });
}

// Toggle product active status
export function useToggleProductStatus() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) => 
      productRepository.update(id, { isActive }),
    onSuccess: (updatedProduct, variables) => {
      queryClient.setQueryData(
        productQueryKeys.detail(variables.id),
        updatedProduct
      );
      queryClient.invalidateQueries({ queryKey: productQueryKeys.lists() });
      success(`Product ${variables.isActive ? 'activated' : 'deactivated'} successfully!`);
    },
    onError: (err: any) => {
      error(err.message || 'Failed to update product status');
    },
  });
}
