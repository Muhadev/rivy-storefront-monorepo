/**
 * Application-wide constants and configuration
 * Centralized configuration management for maintainability
 */

export const APP_CONFIG = {
  name: 'Rivy Store',
  version: '1.0.0',
  description: 'Professional E-commerce Platform',
} as const;

export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1',
  timeout: 30000,
  retryAttempts: 3,
} as const;

export const ROUTES = {
  // Public routes
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  
  // Protected routes
  CART: '/cart',
  CHECKOUT: '/checkout',
  PROFILE: '/profile',
  ORDERS: '/orders',
  ORDER_DETAIL: '/orders/:id',
  
  // Admin routes
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_CUSTOMERS: '/admin/customers',
  ADMIN_DISCOUNTS: '/admin/discounts',
  ADMIN_ANALYTICS: '/admin/analytics',
} as const;

export const PAGINATION = {
  defaultPageSize: 20,
  pageSizeOptions: [10, 20, 50, 100],
} as const;

export const VALIDATION = {
  minPasswordLength: 8,
  maxEmailLength: 254,
  maxNameLength: 100,
} as const;

export const STORAGE_KEYS = {
  authToken: 'rivy_auth_token',
  refreshToken: 'rivy_refresh_token',
  user: 'rivy_user',
  cart: 'rivy_cart',
  theme: 'rivy_theme',
  language: 'rivy_language',
} as const;

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

export const USER_ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
} as const;
