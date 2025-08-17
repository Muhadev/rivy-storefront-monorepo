import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db';

interface ProductAttributes {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number | null;
  imageUrl: string | null;
}

type ProductCreation = Optional<ProductAttributes, 'id' | 'categoryId' | 'imageUrl'>;

class Product extends Model<ProductAttributes, ProductCreation> implements ProductAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public price!: number;
  public stock!: number;
  public categoryId!: number | null;
  public imageUrl!: string | null;

}


Product.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  categoryId: { type: DataTypes.INTEGER, allowNull: true },
  imageUrl: { type: DataTypes.STRING, allowNull: true }
}, { sequelize, tableName: 'products' });

export default Product;
