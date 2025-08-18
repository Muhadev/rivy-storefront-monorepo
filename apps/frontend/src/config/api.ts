export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

export const ENDPOINTS = {
  // Health
  HEALTH: '/health',
  HEALTH_READINESS: '/health/readiness',
  HEALTH_LIVENESS: '/health/liveness',
  
  // Authentication
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  
  // Products
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id: number) => `/products/${id}`,
    CREATE: '/products',
    UPDATE: (id: number) => `/products/${id}`,
    DELETE: (id: number) => `/products/${id}`,
    CATEGORIES: '/products/categories',
  },
  
  // Cart
  CART: {
    GET: '/cart',
    ADD_ITEM: '/cart/items',
    UPDATE_ITEM: (productId: number) => `/cart/items/${productId}`,
    REMOVE_ITEM: (productId: number) => `/cart/items/${productId}`,
    CLEAR: '/cart/clear',
  },
  
  // Orders
  ORDERS: {
    LIST: '/orders/user/me',
    DETAIL: (id: number) => `/orders/${id}`,
    CONFIRM: (id: number) => `/orders/${id}/confirm`,
  },
  
  // Checkout
  CHECKOUT: '/checkout',
  
  // Reviews
  REVIEWS: {
    LIST: '/reviews',
    CREATE: '/reviews',
    UPDATE: (id: number) => `/reviews/${id}`,
    DELETE: (id: number) => `/reviews/${id}`,
  },
  
  // Discounts
  DISCOUNTS: {
    LIST: '/discounts',
    CREATE: '/discounts',
    UPDATE: (id: number) => `/discounts/${id}`,
    DELETE: (id: number) => `/discounts/${id}`,
  },
  
  // Users
  USERS: {
    PROFILE: '/users/me',
    UPDATE: '/users/me', 
    DELETE: '/users/me',
  },
} as const;

export const QUERY_KEYS = {
  HEALTH: ['health'],
  PRODUCTS: ['products'],
  PRODUCT_DETAIL: (id: number) => ['products', id],
  CATEGORIES: ['categories'],
  CART: ['cart'],
  ORDERS: ['orders'],
  ORDER_DETAIL: (id: number) => ['orders', id],
  REVIEWS: ['reviews'],
  DISCOUNTS: ['discounts'],
} as const;