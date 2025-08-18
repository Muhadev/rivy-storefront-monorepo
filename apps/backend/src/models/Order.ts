import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db';
import { OrderItem } from './OrderItem';

interface OrderAttributes {
  id: number;
  userId: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  address: string;
  items?: OrderItem[];
}

type OrderCreation = Optional<OrderAttributes, 'id' | 'status'>;

class Order extends Model<OrderAttributes, OrderCreation> implements OrderAttributes {
  public id!: number;
  public userId!: number;
  public status!: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  public total!: number;
  public address!: string;
  public items?: OrderItem[];
}

Order.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'), defaultValue: 'pending' },
  total: { type: DataTypes.FLOAT, allowNull: false },
  address: { type: DataTypes.STRING, allowNull: false }
}, { sequelize, tableName: 'orders' });

// Define associations
Order.hasMany(OrderItem, { as: 'items', foreignKey: 'orderId' });

export default Order;