/**
 * Categories Hook
 * Centralized category data management
 */

import { useQuery } from '@tanstack/react-query';
import { httpClient } from '../lib/http-client';
import type { Category } from '../types';

// API functions
const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await httpClient.get<Category[]>('/products/categories');
    return response.data;
  },
};

// Hook
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
    staleTime: 10 * 60 * 1000, // 10 minutes - categories don't change often
  });
}
