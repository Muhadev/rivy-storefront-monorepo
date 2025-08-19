import { apiClient } from '@/lib/api-client';

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
  // Get dashboard data
  getDashboardData: async (): Promise<AdminDashboardData> => {
    const response = await apiClient.get('/admin/dashboard');
    return (response as any).data;
  },

  // Get customers with pagination and search
  getCustomers: async (params: { 
    search?: string; 
    page: number; 
    limit: number; 
  }): Promise<CustomersResponse> => {
    const response = await apiClient.get('/admin/customers', { params });
    return (response as any).data;
  },

  // Get customer by ID
  getCustomerById: async (id: number): Promise<Customer> => {
    const response = await apiClient.get(`/admin/customers/${id}`);
    return (response as any).data;
  },

  // Get admin products (products created by the admin)
  getAdminProducts: async (params: { 
    search?: string; 
    category?: string;
    page: number; 
    limit: number; 
  }): Promise<AdminProductsResponse> => {
    const response = await apiClient.get('/admin/products', { params });
    return (response as any).data;
  },

  // Get product statistics
  getProductStats: async (): Promise<any[]> => {
    const response = await apiClient.get('/admin/products/stats');
    return (response as any).data;
  },

  // Get order statistics
  getOrderStats: async (): Promise<any[]> => {
    const response = await apiClient.get('/admin/orders/stats');
    return (response as any).data;
  },
};
