/**
 * Cart Repository
 * Handles all cart-related API operations
 */

import { BaseRepository } from './base-repository';
import type { CartItem, AddToCartData, UpdateCartItemData } from '../../types';

class CartRepository extends BaseRepository<CartItem, AddToCartData, UpdateCartItemData> {
  private endpoint = '/cart';

  constructor() {
    super({
      baseEndpoint: '/cart',
    });
  }

  async getCart() {
    return this.request<CartItem[]>('get', '');
  }

  async addItem(data: AddToCartData) {
    return this.request<CartItem>('post', '/items', data);
  }

  async updateItem(productId: number, data: UpdateCartItemData) {
    return this.request<CartItem>('patch', `/items/${productId}`, data);
  }

  async removeItem(productId: number) {
    return this.request<void>('delete', `/items/${productId}`);
  }

  async clearCart() {
    return this.request<void>('delete', '/clear');
  }

  async getCartTotal() {
    return this.request<{ total: number; itemCount: number }>('get', '/total');
  }
}

export const cartRepository = new CartRepository();
export type { AddToCartData, UpdateCartItemData };
