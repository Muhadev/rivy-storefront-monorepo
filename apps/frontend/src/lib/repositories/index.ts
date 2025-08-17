/**
 * Repository exports
 * Central export point for all repositories
 */

export { BaseRepository } from './base-repository';
export { productRepository } from './product-repository';
export { authRepository } from './auth-repository';
export { orderRepository } from './order-repository';
export { customerRepository } from './customer-repository';
export { discountRepository } from './discount-repository';
export { cartRepository } from './cart-repository';

// Re-export types
export type { RepositoryConfig, QueryParams } from './base-repository';
export type { CreateProductData, UpdateProductData } from './product-repository';
export type { LoginResponse } from './auth-repository';
export type { CreateOrderData, UpdateOrderData } from './order-repository';
export type { CreateCustomerData, UpdateCustomerData } from './customer-repository';
export type { CreateDiscountData, UpdateDiscountData } from './discount-repository';
export type { AddToCartData, UpdateCartItemData } from './cart-repository';
