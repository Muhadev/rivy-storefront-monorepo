import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db';

export interface ReviewAttributes {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  comment: string;
}

export type ReviewCreation = Optional<ReviewAttributes, 'id'>;

class Review extends Model<ReviewAttributes, ReviewCreation> implements ReviewAttributes {
  public id!: number;
  public productId!: number;
  public userId!: number;
  public rating!: number;
  public comment!: string;
}

Review.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  productId: { type: DataTypes.INTEGER, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  rating: { type: DataTypes.INTEGER, allowNull: false },
  comment: { type: DataTypes.TEXT, allowNull: false }
}, { sequelize, tableName: 'reviews' });

export default Review;
