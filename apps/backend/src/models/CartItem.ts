import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db';

interface CartItemAttributes {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
}

type CartItemCreation = Optional<CartItemAttributes, 'id'>;

class CartItem extends Model<CartItemAttributes, CartItemCreation> implements CartItemAttributes {
  public id!: number;
  public userId!: number;
  public productId!: number;
  public quantity!: number;
}

CartItem.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  productId: { type: DataTypes.INTEGER, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false }
}, { sequelize, tableName: 'cart_items' });

export default CartItem;
