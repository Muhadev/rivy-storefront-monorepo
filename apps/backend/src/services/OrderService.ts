  // Removed invalid confirmOrder method (status 'confirmed' does not exist)
import OrderRepository from '../repositories/OrderRepository';
import Order from '../models/Order';
import { OrderItem } from '../models/OrderItem';
import Product from '../models/Product';
import CartItem from '../models/CartItem';

class OrderService {
  /**
   * Confirm an order: transition status from 'pending' or 'processing' to 'processing' or 'confirmed'.
   * Returns updated order or null if not allowed.
   */
  static async confirmOrder(orderId: number) {
    const order = await Order.findByPk(orderId);
    if (!order) return null;
    if (order.status === 'pending') {
      order.status = 'processing';
      await order.save();
      return order;
    }
    if (order.status === 'processing') {
      order.status = 'delivered'; // Use 'delivered' as confirmation for this model
      await order.save();
      return order;
    }
    // Already delivered/cancelled/shipped
    return null;
  }
  static async create(orderData: { userId: number; address: string; items?: Array<{productId: number; quantity: number}> }) {
    // Fetch cart items for user
    const cartItems = await CartItem.findAll({ where: { userId: orderData.userId } });
    if (!cartItems.length) throw new Error('Cart is empty');
    // Reserve inventory
    const reservedProducts: Product[] = [];
    try {
      let total = 0;
      for (const item of cartItems) {
        const product = await Product.findByPk(item.productId);
        if (!product || product.stock < item.quantity) throw new Error('Insufficient stock for product: ' + item.productId);
        product.stock -= item.quantity;
        reservedProducts.push(product);
        total += item.quantity * product.price;
      }
      // Save all reserved products
      for (const product of reservedProducts) {
        await product.save();
      }
      // Create order
      const order = await Order.create({
        userId: orderData.userId,
        status: 'pending',
        total,
        address: orderData.address || ''
      });
      for (const item of cartItems) {
        const product = reservedProducts.find(p => p.id === item.productId);
        await OrderItem.create({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: product ? product.price : 0
        });
      }
      // Clear cart
      await CartItem.destroy({ where: { userId: orderData.userId } });
      return order;
    } catch (err) {
      // Rollback inventory reservation if checkout fails
      for (const product of reservedProducts) {
        product.stock += cartItems.find(i => i.productId === product.id)?.quantity || 0;
        await product.save();
      }
      throw err;
    }
  }
  
  static async getById(id: number) { return OrderRepository.getById(id); }
  static async update(id: number, data: { status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'; address?: string }) { return OrderRepository.update(id, data); }
  static async delete(id: number) { return OrderRepository.delete(id); }
  static async listByUser(userId: number) { return OrderRepository.listByUser(userId); }
}
export default OrderService;