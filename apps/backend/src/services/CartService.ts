import CartRepository from '../repositories/CartRepository';

class CartService {
  static async getCart(userId: number) {
    return CartRepository.getCart(userId);
  }

  static async addItem(userId: number, productId: number, quantity: number) {
    return CartRepository.addItem(userId, productId, quantity);
  }

  static async updateItem(userId: number, productId: number, quantity: number) {
    return CartRepository.updateItem(userId, productId, quantity);
  }

  static async removeItem(userId: number, productId: number) {
    return CartRepository.removeItem(userId, productId);
  }

  static async clearCart(userId: number) {
    return CartRepository.clearCart(userId);
  }
}

export default CartService;
