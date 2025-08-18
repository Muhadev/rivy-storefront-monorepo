  // Removed invalid confirmOrder method (status 'confirmed' does not exist)
import OrderRepository from '../repositories/OrderRepository';
import Order from '../models/Order';
import { OrderItem } from '../models/OrderItem';
import Product from '../models/Product';
import CartItem from '../models/CartItem';
import { sequelize } from '../db';

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
    const transaction = await sequelize.transaction();
    
    try {
      // Fetch cart items for user
      const cartItems = await CartItem.findAll({ 
        where: { userId: orderData.userId },
        transaction 
      });
      
      if (!cartItems.length) {
        await transaction.rollback();
        throw new Error('Cart is empty');
      }

      // Calculate total and reserve inventory in transaction
      let total = 0;
      const orderItems: Array<{productId: number; quantity: number; unitPrice: number}> = [];
      
      for (const item of cartItems) {
        const product = await Product.findByPk(item.productId, { transaction });
        if (!product || product.stock < item.quantity) {
          await transaction.rollback();
          throw new Error('Insufficient stock for product: ' + item.productId);
        }
        
        // Reserve inventory
        product.stock -= item.quantity;
        await product.save({ transaction });
        
        total += item.quantity * product.price;
        orderItems.push({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: product.price
        });
      }

      // Create order
      const order = await Order.create({
        userId: orderData.userId,
        status: 'pending',
        total,
        address: orderData.address || ''
      }, { transaction });

      // Create order items
      for (const item of orderItems) {
        await OrderItem.create({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice
        }, { transaction });
      }

      // Clear cart
      await CartItem.destroy({ 
        where: { userId: orderData.userId },
        transaction 
      });

      // Commit transaction
      await transaction.commit();
      return order;
      
    } catch (err) {
      // Rollback transaction automatically handles inventory restoration
      await transaction.rollback();
      throw err;
    }
  }
  
  /**
   * Cancel an order: transition status to 'cancelled' and restore inventory.
   * Only allows cancelling orders that are 'pending' or 'processing'.
   */
  static async cancelOrder(orderId: number, userId: number) {
    const transaction = await sequelize.transaction();
    
    try {
      const order = await Order.findOne({ 
        where: { id: orderId, userId },
        include: [{ model: OrderItem, as: 'items' }],
        transaction
      });
      
      if (!order) {
        await transaction.rollback();
        return null;
      }
      
      // Only allow cancelling pending or processing orders
      if (order.status !== 'pending' && order.status !== 'processing') {
        await transaction.rollback();
        return null;
      }
      
      // Restore inventory
      if (order.items) {
        for (const item of order.items) {
          const product = await Product.findByPk(item.productId, { transaction });
          if (product) {
            product.stock += item.quantity;
            await product.save({ transaction });
          }
        }
      }
      
      // Update order status
      order.status = 'cancelled';
      await order.save({ transaction });
      
      // Commit transaction
      await transaction.commit();
      return order;
      
    } catch (err) {
      // Rollback transaction automatically handles any failures
      await transaction.rollback();
      throw err;
    }
  }

  static async getById(id: number) { return OrderRepository.getById(id); }
  static async update(id: number, data: { status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'; address?: string }) { return OrderRepository.update(id, data); }
  static async delete(id: number) { return OrderRepository.delete(id); }
  static async listByUser(userId: number) { return OrderRepository.listByUser(userId); }
}
export default OrderService;