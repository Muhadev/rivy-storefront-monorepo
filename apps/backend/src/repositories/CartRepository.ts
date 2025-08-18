import { CartItem, Product } from '../models';
// Ensure associations are loaded
import '../models';

class CartRepository {
  static async getCart(userId: number) {
    // Temporarily simplified to avoid association issues
    const cartItems = await CartItem.findAll({
      where: { userId }
    });
    
    // Manually fetch product data for each cart item
    const cartWithProducts = await Promise.all(
      cartItems.map(async (item) => {
        const product = await Product.findByPk(item.productId, {
          attributes: ['id', 'name', 'description', 'price', 'imageUrl']
        });
        return {
          ...item.toJSON(),
          product: product?.toJSON()
        };
      })
    );
    
    return cartWithProducts;
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