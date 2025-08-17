import CartItem from '../models/CartItem';
import Product from '../models/Product';

class CartRepository {
  static async getCart(userId: number) {
    return CartItem.findAll({
      where: { userId },
      include: [{ model: Product, as: 'product' }]
    });
  }

  static async addItem(userId: number, productId: number, quantity: number) {
    const existingItem = await CartItem.findOne({ where: { userId, productId } });
    
    if (existingItem) {
      existingItem.quantity += quantity;
      await existingItem.save();
      return existingItem;
    }
    
    return CartItem.create({ userId, productId, quantity });
  }

  static async updateItem(userId: number, productId: number, quantity: number) {
    const item = await CartItem.findOne({ where: { userId, productId } });
    if (!item) return null;
    
    if (quantity === 0) {
      await item.destroy();
      return null;
    }
    
    item.quantity = quantity;
    await item.save();
    return item;
  }

  static async removeItem(userId: number, productId: number) {
    const deleted = await CartItem.destroy({ where: { userId, productId } });
    return deleted > 0;
  }

  static async clearCart(userId: number) {
    await CartItem.destroy({ where: { userId } });
  }
}

export default CartRepository;