import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db';

export interface DiscountAttributes {
  id: number;
  code: string;
  percentage: number;
  active: boolean;
}

export type DiscountCreation = Optional<DiscountAttributes, 'id'>;

class Discount extends Model<DiscountAttributes, DiscountCreation> implements DiscountAttributes {
  public id!: number;
  public code!: string;
  public percentage!: number;
  public active!: boolean;
}

Discount.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  code: { type: DataTypes.STRING, allowNull: false, unique: true },
  percentage: { type: DataTypes.FLOAT, allowNull: false },
  active: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { sequelize, tableName: 'discounts' });

export default Discount;
