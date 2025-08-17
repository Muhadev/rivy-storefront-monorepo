/**
 * Product Repository
 * Handles all product-related API operations
 */

import { BaseRepository } from './base-repository';
import type { Product, ProductFilters, Category } from '../../types';

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: number;
  stock: number;
  sku: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  tags?: string[];
}

export interface UpdateProductData extends Partial<CreateProductData> {
  isActive?: boolean;
}

class ProductRepository extends BaseRepository<Product, CreateProductData, UpdateProductData> {
  constructor() {
    super({
      baseEndpoint: '/products',
      cacheTimeout: 10 * 60 * 1000, // 10 minutes for products
    });
  }

  /**
   * Get products with advanced filtering
   */
  async getProducts(filters: ProductFilters = {}) {
    return this.findAll(filters);
  }

  /**
   * Alias for getProducts
   */
  async getAll(filters: ProductFilters = {}) {
    return this.getProducts(filters);
  }

  /**
   * Get product by slug or ID
   */
  async getProduct(identifier: string | number) {
    return this.findById(identifier);
  }

  /**
   * Alias for getProduct
   */
  async getById(identifier: string | number) {
    return this.getProduct(identifier);
  }

  /**
   * Get products by category
   */
  async getProductsByCategory(categoryId: number, params?: Omit<ProductFilters, 'categoryId'>) {
    return this.request<Product[]>('get', `/category/${categoryId}`, null, { params });
  }

  /**
   * Get featured products
   */
  async getFeaturedProducts(limit: number = 8) {
    return this.request<Product[]>('get', '/featured', null, { params: { limit } });
  }

  /**
   * Get popular products
   */
  async getPopularProducts(limit: number = 8) {
    return this.request<Product[]>('get', '/popular', null, { params: { limit } });
  }

  /**
   * Get recently viewed products for user
   */
  async getRecentlyViewed(limit: number = 5) {
    return this.request<Product[]>('get', '/recently-viewed', null, { params: { limit } });
  }

  /**
   * Get related products
   */
  async getRelatedProducts(productId: number, limit: number = 4) {
    return this.request<Product[]>('get', `/${productId}/related`, null, { params: { limit } });
  }

  /**
   * Search products with advanced filters
   */
  async searchProducts(query: string, filters: Omit<ProductFilters, 'search'> = {}) {
    return this.search(query, filters);
  }

  /**
   * Get product recommendations for user
   */
  async getRecommendations(userId?: number, limit: number = 8) {
    return this.request<Product[]>('get', '/recommendations', null, {
      params: { userId, limit }
    });
  }

  /**
   * Check product availability
   */
  async checkAvailability(productId: number, quantity: number = 1) {
    return this.request<{ available: boolean; maxQuantity: number }>('get', 
      `/${productId}/availability`, null, { params: { quantity } }
    );
  }

  /**
   * Get product variants (if applicable)
   */
  async getProductVariants(productId: number) {
    return this.request<Product[]>('get', `/${productId}/variants`);
  }

  /**
   * Record product view (for analytics)
   */
  async recordView(productId: number) {
    return this.request<void>('post', `/${productId}/view`, {}, { skipRetry: true });
  }

  /**
   * Get product reviews
   */
  async getProductReviews(productId: number, params?: {
    page?: number;
    limit?: number;
    sortBy?: 'rating' | 'date' | 'helpful';
    sortOrder?: 'asc' | 'desc';
  }) {
    return this.request<any>('get', `/${productId}/reviews`, null, { params });
  }

  /**
   * Get product price history
   */
  async getPriceHistory(productId: number, days: number = 30) {
    return this.request<any[]>('get', `/${productId}/price-history`, null, {
      params: { days }
    });
  }

  /**
   * Get product categories
   */
  async getCategories() {
    return this.request<Category[]>('get', '/categories');
  }

  /**
   * Get products on sale
   */
  async getProductsOnSale(params?: {
    page?: number;
    limit?: number;
    categoryId?: number;
  }) {
    return this.request<Product[]>('get', '/on-sale', null, { params });
  }

  /**
   * Get products with low stock (admin)
   */
  async getLowStockProducts(threshold: number = 10) {
    return this.request<Product[]>('get', '/low-stock', null, {
      params: { threshold }
    });
  }

  /**
   * Update product stock (admin)
   */
  async updateStock(productId: number, quantity: number, operation: 'set' | 'add' | 'subtract' = 'set') {
    return this.request<Product>('patch', `/${productId}/stock`, {
      quantity,
      operation
    });
  }

  /**
   * Bulk update product prices (admin)
   */
  async bulkUpdatePrices(updates: Array<{
    productId: number;
    price: number;
    discountPercentage?: number;
  }>) {
    return this.request<Product[]>('patch', '/bulk-prices', { updates });
  }

  /**
   * Upload product image
   */
  async uploadImage(productId: number, file: File, onProgress?: (progress: number) => void) {
    const formData = new FormData();
    formData.append('image', file);
    
    return this.request<{ imageUrl: string }>('post', `/${productId}/image`, formData, {
      skipRetry: true
    });
  }

  /**
   * Get product analytics (admin)
   */
  async getProductAnalytics(productId: number, period: '7d' | '30d' | '90d' | '1y' = '30d') {
    return this.request<{
      views: number;
      sales: number;
      revenue: number;
      conversionRate: number;
      averageRating: number;
      reviewCount: number;
    }>('get', `/${productId}/analytics`, null, { params: { period } });
  }
}

export const productRepository = new ProductRepository();
export default productRepository;
