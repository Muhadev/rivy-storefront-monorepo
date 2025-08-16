import Product from './Product';
import Category from './Category';
import Order from './Order';
import { OrderItem } from './OrderItem';
import CartItem from './CartItem';
import Review from './Review';
import Discount from './Discount';
import User from './User';

// Order associations
Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

// User-Order associations
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

// Product-Review associations
Product.hasMany(Review, { foreignKey: 'productId' });
Review.belongsTo(Product, { foreignKey: 'productId' });
User.hasMany(Review, { foreignKey: 'userId' });
Review.belongsTo(User, { foreignKey: 'userId' });

// CartItem associations - KEEP ONLY THESE WITH ALIASES
CartItem.belongsTo(Product, { foreignKey: 'productId', as: 'Product' });
CartItem.belongsTo(User, { foreignKey: 'userId', as: 'User' });
Product.hasMany(CartItem, { foreignKey: 'productId', as: 'CartItems' });
User.hasMany(CartItem, { foreignKey: 'userId', as: 'CartItems' });

// Category-Product associations
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

export { Product, Category, Order, OrderItem, CartItem, Review, Discount, User };