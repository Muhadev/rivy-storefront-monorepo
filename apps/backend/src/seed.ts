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

  // Users (idempotent)
  const [admin] = await User.findOrCreate({
    where: { email: 'admin@rivy.com' },
    defaults: { email: 'admin@rivy.com', passwordHash: '$2a$10$adminhash', name: 'Admin User', role: 'admin' }
  });
  const [user] = await User.findOrCreate({
    where: { email: 'user@rivy.com' },
    defaults: { email: 'user@rivy.com', passwordHash: '$2a$10$userhash', name: 'Regular User', role: 'customer' }
  });

  // Categories (4) - idempotent
  const categorySpecs = [
    { name: 'Solar Panels', description: 'High-efficiency solar panels for renewable energy' },
    { name: 'Batteries', description: 'Energy storage solutions and battery packs' },
    { name: 'Inverters', description: 'Power inverters and converters' },
    { name: 'Solar Cables', description: 'Cables and wiring for solar installations' }
  ];
  const categories: Category[] = [] as any;
  for (const spec of categorySpecs) {
    const [c] = await Category.findOrCreate({ where: { name: spec.name }, defaults: spec });
    categories.push(c);
  }

  // Image URLs per category (from user-provided sources)
  const imageMap = {
    panels: 'https://cdn.britannica.com/94/192794-050-3F3F3DDD/panels-electricity-order-sunlight.jpg',
    batteries: 'https://grecopower.com.ng/wp-content/uploads/2021/04/152.png',
    inverter: 'https://www.qoltec.com/files/en/product/gallery/image-635149b0591ba.jpg',
    cables: 'https://media.istockphoto.com/id/1127159212/photo/different-details-instruments-for-installing-solar-system.jpg?s=1024x1024&w=is&k=20&c=MxdIiddZtf5MiXlt48hqxhvDUb_pLwlJR5FVb6-P9nk='
  } as const;

  // Helper to generate N items
  function range(n: number) { return Array.from({ length: n }, (_, i) => i + 1); }

  // Products: 10 per category, assign createdBy admin
  const products: Product[] = [] as any;
  for (const [idx, cat] of categories.entries()) {
    const baseName = [
      'Solar Panel',
      'Battery',
      'Inverter',
      'Solar Cable'
    ][idx];
    const imageUrl = [
      imageMap.panels,
      imageMap.batteries,
      imageMap.inverter,
      imageMap.cables
    ][idx];
    for (const i of range(10)) {
      const name = `${baseName} ${i}`;
      const existing = await Product.findOne({ where: { name, categoryId: cat.id, createdBy: admin.id } });
      if (existing) {
        products.push(existing);
        continue;
      }
      const p = await Product.create({
        name,
        description: `High-quality ${baseName.toLowerCase()} suitable for residential and commercial clean energy systems.`,
        price: Number((50 + Math.random() * 950).toFixed(2)),
        stock: Math.floor(5 + Math.random() * 100),
        categoryId: cat.id,
        imageUrl,
        createdBy: admin.id
      });
      products.push(p);
    }
  }
  // Discounts
  // Discounts - idempotent
  const discountSpecs = [
    { code: 'GREEN10', type: 'percentage' as const, value: 10, isActive: true, description: '10% off green energy gear' },
    { code: 'SOLAR50', type: 'fixed' as const, value: 50, isActive: true, description: '$50 off orders over $500', minOrderAmount: 500 },
  ];
  for (const d of discountSpecs) {
    await Discount.findOrCreate({ where: { code: d.code }, defaults: d });
  }

  // Reviews
  for (const p of products.slice(0, 8)) {
    const exists = await Review.findOne({ where: { productId: p.id, userId: user.id } });
    if (!exists) {
      await Review.create({ productId: p.id, userId: user.id, rating: (3 + (p.id % 3)) as 3 | 4 | 5, comment: `Solid ${p.name}. Performs as expected.` });
    }
  }

  // Cart Items
  await CartItem.findOrCreate({ where: { userId: user.id, productId: products[0].id }, defaults: { userId: user.id, productId: products[0].id, quantity: 2 } });
  await CartItem.findOrCreate({ where: { userId: user.id, productId: products[5].id }, defaults: { userId: user.id, productId: products[5].id, quantity: 1 } });

  // Orders & OrderItems
  const [order] = await Order.findOrCreate({
    where: { userId: user.id, status: 'processing', total: products[0].price * 2, address: '123 Solar St' },
    defaults: { userId: user.id, status: 'processing', total: products[0].price * 2, address: '123 Solar St' }
  });
  const oiExists = await OrderItem.findOne({ where: { orderId: order.id, productId: products[0].id } });
  if (!oiExists) {
    await OrderItem.create({ orderId: order.id, productId: products[0].id, quantity: 2, unitPrice: products[0].price });
  }

  console.log('Seed completed');
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
