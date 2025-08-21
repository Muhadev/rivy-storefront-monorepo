import { apiClient } from '@/lib/api-client';
import { ENDPOINTS } from '@/config/api';

export interface AdminDashboardData {
  stats: {
    totalProducts: number;
    totalOrders: number;
    totalCustomers: number;
    totalReviews: number;
    totalDiscounts: number;
  };
  recentOrders: any[];
  lowStockProducts: any[];
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export interface CustomersResponse {
  customers: Customer[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface AdminProductsResponse {
  products: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const adminApi = {
  // Dashboard summary using backend admin endpoint
  getDashboardSummary: async (): Promise<AdminDashboardData> => {
    return await apiClient.get('/admin/dashboard');
  },

  // List all users (admin only)
  getCustomers: async (params: { search?: string; page: number; limit: number; }) => {
    return apiClient.get(ENDPOINTS.USERS.LIST, params);
  },

  // List products
  getAdminProducts: async (params: { search?: string; category?: string; page: number; limit: number; }) => {
    return apiClient.get(ENDPOINTS.PRODUCTS.LIST, params);
  },

  // Create product
  createProduct: async (data: any) => {
    return apiClient.post(ENDPOINTS.PRODUCTS.CREATE, data);
  },

  // Update product
  updateProduct: async (id: number, data: any) => {
    return apiClient.put(ENDPOINTS.PRODUCTS.UPDATE(id), data);
  },

  // Delete product
  deleteProduct: async (id: number) => {
    return apiClient.delete(ENDPOINTS.PRODUCTS.DELETE(id));
  },

  // List discounts
  getDiscounts: async (params: { page: number; limit: number; }) => {
    return apiClient.get(ENDPOINTS.DISCOUNTS.LIST, params);
  },

  // Create discount
  createDiscount: async (data: any) => {
    return apiClient.post(ENDPOINTS.DISCOUNTS.CREATE, data);
  },

  // Update discount
  updateDiscount: async (id: number, data: any) => {
    return apiClient.put(ENDPOINTS.DISCOUNTS.UPDATE(id), data);
  },

  // Delete discount
  deleteDiscount: async (id: number) => {
    return apiClient.delete(ENDPOINTS.DISCOUNTS.DELETE(id));
  },

  // List reviews
  getReviews: async (params: { page: number; limit: number; }) => {
    return apiClient.get(ENDPOINTS.REVIEWS.LIST, params);
  },

  // Create review
  createReview: async (data: any) => {
    return apiClient.post(ENDPOINTS.REVIEWS.CREATE, data);
  },

  // Update review
  updateReview: async (id: number, data: any) => {
    return apiClient.put(ENDPOINTS.REVIEWS.UPDATE(id), data);
  },

  // Delete review
  deleteReview: async (id: number) => {
    return apiClient.delete(ENDPOINTS.REVIEWS.DELETE(id));
  },

  // Get customer by ID (using /users/:id endpoint)
  getCustomerById: async (id: number): Promise<Customer> => {
    const response = await apiClient.get(`/users/${id}`) as any;
    return response.data;
  },

  // Product statistics (return empty array if not available)
  getProductStats: async (): Promise<any[]> => {
    return [];
  },

  // Order statistics (return empty array if not available)
  getOrderStats: async (): Promise<any[]> => {
    return [];
  },
};