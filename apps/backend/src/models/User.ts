import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db';

interface UserAttributes {
  id: number;
  email: string;
  passwordHash: string;
  name: string;
  role: 'customer' | 'admin';
}

type UserCreation = Optional<UserAttributes, 'id' | 'role'>;

class User extends Model<UserAttributes, UserCreation> implements UserAttributes {
  public id!: number;
  public email!: string;
  public passwordHash!: string;
  public name!: string;
  public role!: 'customer' | 'admin';
}

User.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false},
  role: { type: DataTypes.ENUM('customer','admin'), defaultValue: 'customer' }
}, { sequelize, tableName: 'users' });

export default User;
