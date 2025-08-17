/**
 * Admin Dashboard Hook
 * Manages dashboard data fetching and state
 */

import { useQuery } from '@tanstack/react-query';
import { adminConfig } from '../config/admin';

export interface DashboardStats {
  totalProducts: number;
  totalCustomers: number;
  totalOrders: number;
  totalRevenue: number;
}

export interface RecentOrder {
  id: string;
  customer: string;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  date: string;
}

export interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recentOrders: RecentOrder[];
  topProducts: TopProduct[];
}

// Mock API function - replace with actual API call
const fetchDashboardData = async (): Promise<DashboardData> => {
  // In a real app, this would be an actual API call
  // return httpClient.get(adminConfig.api.endpoints.dashboard);
  
  // Mock data for now
  return {
    stats: {
      totalProducts: 156,
      totalCustomers: 1247,
      totalOrders: 89,
      totalRevenue: 45230,
    },
    recentOrders: [
      {
        id: 'ORD-001',
        customer: 'John Doe',
        amount: 299.99,
        status: 'completed',
        date: new Date().toISOString(),
      },
      {
        id: 'ORD-002', 
        customer: 'Jane Smith',
        amount: 149.50,
        status: 'pending',
        date: new Date().toISOString(),
      },
      {
        id: 'ORD-003',
        customer: 'Bob Johnson', 
        amount: 599.00,
        status: 'completed',
        date: new Date().toISOString(),
      },
    ],
    topProducts: [
      {
        id: 'PROD-001',
        name: 'Premium Headphones',
        sales: 45,
        revenue: 13475,
      },
      {
        id: 'PROD-002',
        name: 'Wireless Mouse',
        sales: 123,
        revenue: 8610,
      },
      {
        id: 'PROD-003',
        name: 'Gaming Keyboard',
        sales: 67,
        revenue: 6030,
      },
    ],
  };
};

export function useDashboardData() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: fetchDashboardData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // 30 seconds
  });
}
