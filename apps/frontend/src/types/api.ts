export interface User {
  id: number;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  role: 'customer' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number | null;
  imageUrl: string | null;
  category?: Category;
  specifications?: Record<string, string>;
  reviews?: Review[];
  averageRating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  product?: Product;
  subtotal?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  items: CartItem[];
  summary: {
    itemCount: number;
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
  };
}

export interface Order {
  id: number;
  userId: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  totalPrice?: number;
  price?: number; // alias for unitPrice
  product?: Product;
}

export interface Review {
  id: number;
  userId: number;
  productId: number;
  rating: number;
  title?: string;
  comment: string;
  verified?: boolean;
  helpful?: number;
  userName?: string;
  user?: {
    id: number;
    name: string;
  };
  product?: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Discount {
  id: number;
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount?: number;
  maxUses?: number;
  usedCount?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  timestamp: string;
  correlationId: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Backend-specific response structure for products
export interface BackendProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean; // Note: backend uses 'hasPrevious' not 'hasPrev'
  };
}

export interface ApiError {
  error: {
    message: string;
    code: string;
    details?: any;
    field?: string;
  };
  timestamp: string;
  correlationId: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresIn: string;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  q?: string;
  category?: number;
  minPrice?: number;
  maxPrice?: number;
}

export interface CheckoutData {
  items: {
    productId: number;
    quantity: number;
    price: number;
  }[];
  shippingAddress: {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer';
  totalAmount: number;
}

export interface HealthStatus {
  status: string;
  message: string;
  timestamp: string;
  version: string;
  uptime: number;
  database: string;
}