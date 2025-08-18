import { apiClient } from '@/lib/api-client';
import { ENDPOINTS } from '@/config/api';
import { Cart, CartItem, ApiResponse } from '@/types/api';

export interface AddToCartData {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemData {
  quantity: number;
}

export class CartRepository {
  async getCart(): Promise<CartItem[]> {
    return await apiClient.get<CartItem[]>(ENDPOINTS.CART.GET);
  }

  async addToCart(data: AddToCartData): Promise<CartItem> {
    // Backend returns cart item directly, not wrapped
    return await apiClient.post<CartItem>(
      ENDPOINTS.CART.ADD_ITEM,
      data
    );
  }

  async updateCartItem(productId: number, data: UpdateCartItemData): Promise<CartItem> {
    // Backend returns cart item directly, not wrapped
    return await apiClient.patch<CartItem>(
      ENDPOINTS.CART.UPDATE_ITEM(productId),
      data
    );
  }

  async removeCartItem(productId: number): Promise<void> {
    await apiClient.delete(ENDPOINTS.CART.REMOVE_ITEM(productId));
  }

  async clearCart(): Promise<void> {
    await apiClient.delete(ENDPOINTS.CART.CLEAR);
  }
}

export const cartRepository = new CartRepository();