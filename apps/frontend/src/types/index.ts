/**
 * Type definitions for the application
 * Comprehensive type safety across the frontend
 */

// Base entity types
export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
}

// User and Authentication types
export interface User extends BaseEntity {
  email: string;
  name: string; // Backend uses single 'name' field
  role: 'customer' | 'admin';
  passwordHash?: string; // Only used in backend
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  acceptTerms: boolean;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// Product types
export interface Category extends BaseEntity {
  name: string;
  description?: string;
  imageUrl?: string;
  parentId?: number;
  isActive: boolean;
}

export interface Product extends BaseEntity {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: number;
  category?: Category;
  stock: number;
  sku: string;
  isActive: boolean;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  tags?: string[];
  reviews?: Review[];
  averageRating?: number;
  totalReviews?: number;
}

export interface ProductFilters {
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: 'name' | 'price' | 'createdAt' | 'rating';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  inStock?: boolean;
}

// Cart types
export interface CartItem extends BaseEntity {
  productId: number;
  product?: Product;
  quantity: number;
  userId: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  tax: number;
  total: number;
  discountAmount?: number;
  discountCode?: string;
}

// Order types
export interface OrderItem {
  id: number;
  productId: number;
  product?: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order extends BaseEntity {
  userId: number;
  user?: User;
  items: OrderItem[];
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  discountAmount?: number;
  discountCode?: string;
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  notes?: string;
}

// Address types
export interface Address {
  id?: number;
  firstName: string;
  lastName: string;
  company?: string;
  streetAddress: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber?: string;
  isDefault?: boolean;
}

// Review types
export interface Review extends BaseEntity {
  userId: number;
  user?: User;
  productId: number;
  product?: Product;
  rating: number;
  title: string;
  comment: string;
  isVerified: boolean;
  helpfulCount: number;
}

// Discount types
export interface Discount extends BaseEntity {
  code: string;
  description?: string;
  type: 'percentage' | 'fixed';
  value: number; // Percentage (0-100) or fixed amount
  minOrderAmount?: number;
  maxUses?: number;
  usedCount: number;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
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

export interface ApiError {
  message: string;
  code: string;
  status: number;
  errors?: Record<string, string[]>;
}

// Form types
export interface FormState<T> {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}

// Table types
export interface TableColumn<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
  };
  sorting?: {
    key: keyof T;
    order: 'asc' | 'desc';
    onSort: (key: keyof T, order: 'asc' | 'desc') => void;
  };
  selection?: {
    selectedIds: (string | number)[];
    onSelectionChange: (ids: (string | number)[]) => void;
    onSelectAll: () => void;
    onDeselectAll: () => void;
  };
  actions?: {
    label: string;
    icon?: React.ReactNode;
    onClick: (row: T) => void;
    variant?: 'primary' | 'secondary' | 'danger';
    disabled?: (row: T) => boolean;
  }[];
}

// Modal types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: React.ReactNode;
}

// Toast types
export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  actions?: {
    label: string;
    onClick: () => void;
  }[];
}

// Theme types
export interface Theme {
  colors: typeof import('../config/theme').colors;
  typography: typeof import('../config/theme').typography;
  spacing: typeof import('../config/theme').spacing;
  shadows: typeof import('../config/theme').shadows;
  borderRadius: typeof import('../config/theme').borderRadius;
  animation: typeof import('../config/theme').animation;
}

// Analytics types
export interface AnalyticsEvent {
  event: string;
  category: string;
  label?: string;
  value?: number;
  properties?: Record<string, any>;
}

// File upload types
export interface FileUpload {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  url?: string;
  error?: string;
}

// Search types
export interface SearchResult<T> {
  item: T;
  score: number;
  matches: {
    field: keyof T;
    indices: [number, number][];
  }[];
}

// Chart types (for analytics dashboard)
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

// Component prop types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface InputProps {
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
}

// Route protection types
export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: User['role'];
  fallbackPath?: string;
}

// Missing types from hooks and repositories
export interface OrderFilters {
  status?: string;
  customerId?: number;
  dateFrom?: string;
  dateTo?: string;
  minTotal?: number;
  maxTotal?: number;
}

export interface CreateOrderData {
  customerId: number;
  items: Array<{
    productId: number;
    quantity: number;
    price: number;
  }>;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  notes?: string;
}

export interface UpdateOrderData {
  status?: string;
  notes?: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  categoryId: number;
  stock: number;
  sku: string;
  imageUrl: string; // Changed from images array to single imageUrl
  tags?: string[];
  isActive?: boolean;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  categoryId?: number;
  stock?: number;
  sku?: string;
  imageUrl?: string; // Changed from images array to single imageUrl
  tags?: string[];
  isActive?: boolean;
}

export interface AddToCartData {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemData {
  quantity: number;
}

export interface CustomerFilters {
  search?: string;
  role?: string;
  isActive?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

export interface CreateCustomerData {
  email: string;
  name: string;
  password: string;
  role: 'customer' | 'admin';
}

export interface UpdateCustomerData {
  email?: string;
  name?: string;
  role?: 'customer' | 'admin';
  isActive?: boolean;
}

export interface CreateDiscountData {
  code: string;
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  isActive: boolean;
}

export interface UpdateDiscountData {
  code?: string;
  name?: string;
  type?: 'percentage' | 'fixed';
  value?: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  startDate?: string;
  endDate?: string;
  usageLimit?: number;
  isActive?: boolean;
}

export interface DiscountFilters {
  search?: string;
  type?: string;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
}
