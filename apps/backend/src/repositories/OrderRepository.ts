import Order from '../models/Order';

interface CreateOrderData {
  userId: number;
  status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  address: string;
}

interface UpdateOrderData {
  status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total?: number;
  address?: string;
}

class OrderRepository {
  static async create(data: CreateOrderData) { return Order.create(data); }
  static async getById(id: number) { return Order.findByPk(id); }
  static async update(id: number, data: UpdateOrderData) {
    const order = await Order.findByPk(id);
    if (!order) return null;
    await order.update(data);
    return order;
  }
  static async delete(id: number) {
    const order = await Order.findByPk(id);
    if (!order) return false;
    await order.destroy();
    return true;
  }
  static async listByUser(userId: number) { return Order.findAll({ where: { userId } }); }
}
export default OrderRepository;