import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db';

interface CategoryAttributes { 
  id: number; 
  name: string; 
  description?: string;
}
type CategoryCreation = Optional<CategoryAttributes, 'id'>;

class Category extends Model<CategoryAttributes, CategoryCreation> implements CategoryAttributes {
  public id!: number;
  public name!: string;
  public description?: string;
}

Category.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  description: { type: DataTypes.TEXT, allowNull: true }
}, { sequelize, tableName: 'categories' });

export default Category;