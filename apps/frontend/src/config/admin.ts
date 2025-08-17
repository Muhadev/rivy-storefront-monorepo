/**
 * Admin Configuration
 * Centralized configuration for admin panel behavior and appearance
 */

import {
  HomeIcon,
  ShoppingBagIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  TagIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

export interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  badge?: number;
  permission?: string; // For role-based access
}

export interface AdminConfig {
  navigation: NavItem[];
  theme: {
    sidebarWidth: string;
    primaryColor: string;
    secondaryColor: string;
  };
  features: {
    analytics: boolean;
    darkMode: boolean;
    notifications: boolean;
  };
  api: {
    endpoints: {
      dashboard: string;
      products: string;
      orders: string;
      customers: string;
      analytics: string;
    };
  };
}

export const adminConfig: AdminConfig = {
  navigation: [
    { name: 'Dashboard', href: '/admin', icon: HomeIcon },
    { name: 'Products', href: '/admin/products', icon: ShoppingBagIcon },
    { name: 'Orders', href: '/admin/orders', icon: ClipboardDocumentListIcon },
    { name: 'Customers', href: '/admin/customers', icon: UsersIcon },
    { name: 'Discounts', href: '/admin/discounts', icon: TagIcon },
    { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
    { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
  ],
  theme: {
    sidebarWidth: '16rem',
    primaryColor: 'blue',
    secondaryColor: 'gray',
  },
  features: {
    analytics: true,
    darkMode: true,
    notifications: true,
  },
  api: {
    endpoints: {
      dashboard: '/admin/dashboard/stats',
      products: '/admin/products',
      orders: '/admin/orders',
      customers: '/admin/customers',
      analytics: '/admin/analytics',
    },
  },
};

// Admin text constants for localization
export const adminText = {
  dashboard: {
    title: 'Dashboard',
    subtitle: "Welcome back! Here's what's happening with your store.",
    stats: {
      products: 'Total Products',
      customers: 'Total Customers', 
      orders: 'Total Orders',
      revenue: 'Revenue',
    },
    sections: {
      recentOrders: 'Recent Orders',
      topProducts: 'Top Products',
    },
  },
  navigation: {
    logout: 'Sign Out',
    profile: 'Profile',
  },
  common: {
    loading: 'Loading...',
    error: 'Something went wrong',
    noData: 'No data available',
  },
} as const;
