import { connectDb } from './db';
import User from './models/User';
import Category from './models/Category';
import Product from './models/Product';
import Discount from './models/Discount';
import Review from './models/Review';
import Order from './models/Order';
import { OrderItem } from './models/OrderItem';
import CartItem from './models/CartItem';

async function main() {
  await connectDb();

  // Users
  const admin = await User.create({ email: 'admin@rivy.com', passwordHash: '$2a$10$adminhash', name:'Admin User', role: 'admin' });
  const user = await User.create({ email: 'user@rivy.com', passwordHash: '$2a$10$userhash', name:'Regular User', role: 'customer' });

  // Categories
  const categories = await Promise.all([
    Category.create({ name: 'Solar Panels', description: 'High-efficiency solar panels for renewable energy' }),
    Category.create({ name: 'Electronics', description: 'Electronic devices and accessories' }), // This will be id=2
    Category.create({ name: 'Batteries', description: 'Energy storage solutions and battery packs' }),
    Category.create({ name: 'Inverters', description: 'Power inverters and converters' }),
    Category.create({ name: 'Accessories', description: 'Solar system accessories and components' })
  ]);

  // Products
  const products = await Product.bulkCreate([
    { name: 'Panel 250W', description: 'High efficiency panel', price: 120.00, stock: 20, categoryId: categories[0].id, imageUrl: 'https://example.com/panel-250w.jpg' },
    { name: 'Panel 400W', description: 'Premium efficiency panel', price: 220.00, stock: 10, categoryId: categories[0].id, imageUrl: 'https://example.com/panel-400w.jpg' },
    { name: 'Gaming Mouse Pro', description: 'High-precision gaming mouse with RGB', price: 79.99, stock: 50, categoryId: categories[1].id, imageUrl: 'https://example.com/gaming-mouse.jpg' },
    { name: 'Wireless Keyboard', description: 'Mechanical wireless keyboard', price: 149.99, stock: 30, categoryId: categories[1].id, imageUrl: 'https://example.com/keyboard.jpg' },
    { name: 'Battery 2kWh', description: 'Lithium battery pack', price: 300.00, stock: 5, categoryId: categories[2].id, imageUrl: 'https://example.com/battery-2kwh.jpg' },
    { name: 'Battery 5kWh', description: 'High capacity lithium battery', price: 750.00, stock: 3, categoryId: categories[2].id, imageUrl: 'https://example.com/battery-5kwh.jpg' },
    { name: 'Inverter 3000W', description: 'Pure sine wave inverter', price: 450.00, stock: 8, categoryId: categories[3].id, imageUrl: 'https://example.com/inverter-3000w.jpg' },
    { name: 'Solar Cable Kit', description: 'MC4 connector cable kit', price: 35.00, stock: 100, categoryId: categories[4].id, imageUrl: 'https://example.com/cable-kit.jpg' }
  ]);
  // Discounts
  await Discount.create({ 
    code: 'SUMMER25', 
    type: 'percentage', 
    value: 25, 
    isActive: true,
    description: 'Summer sale discount' 
  });

  // Reviews
  await Review.create({ productId: products[0].id, userId: user.id, rating: 5, comment: 'Great panel!' });

  // Cart Items
  await CartItem.create({ userId: user.id, productId: products[0].id, quantity: 2 });

  // Orders & OrderItems
  const order = await Order.create({ userId: user.id, status: 'pending', total: 240, address: '123 Solar St' });
  await OrderItem.create({ orderId: order.id, productId: products[0].id, quantity: 2, unitPrice: 120 });

  console.log('Seed completed');
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
