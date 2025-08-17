import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db';

export interface DiscountAttributes {
  id: number;
  code: string;
  description?: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount?: number;
  maxUses?: number;
  usedCount: number;
  startDate?: Date;
  endDate?: Date;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type DiscountCreation = Optional<DiscountAttributes, 'id' | 'usedCount' | 'isActive' | 'createdAt' | 'updatedAt'>;

class Discount extends Model<DiscountAttributes, DiscountCreation> implements DiscountAttributes {
  public id!: number;
  public code!: string;
  public description?: string;
  public type!: 'percentage' | 'fixed';
  public value!: number;
  public minOrderAmount?: number;
  public maxUses?: number;
  public usedCount!: number;
  public startDate?: Date;
  public endDate?: Date;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Discount.init({
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  code: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true 
  },
  description: { 
    type: DataTypes.TEXT 
  },
  type: { 
    type: DataTypes.ENUM('percentage', 'fixed'), 
    allowNull: false 
  },
  value: { 
    type: DataTypes.DECIMAL(10, 2), 
    allowNull: false 
  },
  minOrderAmount: { 
    type: DataTypes.DECIMAL(10, 2), 
    defaultValue: 0 
  },
  maxUses: { 
    type: DataTypes.INTEGER 
  },
  usedCount: { 
    type: DataTypes.INTEGER, 
    defaultValue: 0 
  },
  startDate: { 
    type: DataTypes.DATE 
  },
  endDate: { 
    type: DataTypes.DATE 
  },
  isActive: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true 
  }
}, { 
  sequelize, 
  tableName: 'discounts',
  timestamps: true
});

export default Discount;
