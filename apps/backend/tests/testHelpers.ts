import { sequelize } from '../src/db';
import User from '../src/models/User';
import Product from '../src/models/Product';
import Category from '../src/models/Category';
import Discount from '../src/models/Discount';
import bcrypt from 'bcryptjs';

export async function setupTestDatabase() {
  try {
    // Authenticate database connection
    await sequelize.authenticate();
    console.log('Database connected for tests');

    // Sync all models (drop and recreate tables)
    await sequelize.sync({ force: true });
    console.log('Database tables synced');

    // Create test users
    const hashedPassword = await bcrypt.hash('testpass123', 10);
    const testUser = await User.create({
      email: 'testuser@example.com',
      passwordHash: hashedPassword,
      name: 'Test user',
      role: 'customer'
    });

    const adminUser = await User.create({
      email: 'admin@example.com',
      passwordHash: hashedPassword,
      name: 'Admin User',
      role: 'admin'
    });

    // Create test categories
    const solarCategory = await Category.create({
      name: 'Solar Panels',
      description: 'High-efficiency solar panels'
    });

    const batteryCategory = await Category.create({
      name: 'Batteries',
      description: 'Energy storage solutions'
    });

    // Create test products for both admin and test user
    const products = await Product.bulkCreate([
      {
        name: 'High-Efficiency Solar Panel',
        description: 'Premium 400W solar panel for residential use',
        price: 299.99,
        stock: 50,
        categoryId: solarCategory.id,
        imageUrl: 'https://example.com/solar-panel.jpg',
        createdBy: adminUser.id
      },
      {
        name: 'Solar Inverter',
        description: 'Grid-tie inverter for solar panel systems',
        price: 599.99,
        stock: 25,
        categoryId: solarCategory.id,
        imageUrl: 'https://example.com/inverter.jpg',
        createdBy: adminUser.id
      },
      {
        name: 'Lithium Battery Pack',
        description: '10kWh lithium battery for energy storage',
        price: 899.99,
        stock: 15,
        categoryId: batteryCategory.id,
        imageUrl: 'https://example.com/battery.jpg',
        createdBy: adminUser.id
      },
      {
        name: 'Solar Charge Controller',
        description: 'MPPT charge controller for battery charging',
        price: 199.99,
        stock: 30,
        categoryId: solarCategory.id,
        imageUrl: 'https://example.com/controller.jpg',
        createdBy: adminUser.id
      },
      // Products for test user
      {
        name: 'Test User Solar Panel',
        description: 'Test user product for integration tests',
        price: 199.99,
        stock: 10,
        categoryId: solarCategory.id,
        imageUrl: 'https://example.com/test-user-panel.jpg',
        createdBy: testUser.id
      },
      {
        name: 'Test User Battery',
        description: 'Test user battery for integration tests',
        price: 299.99,
        stock: 5,
        categoryId: batteryCategory.id,
        imageUrl: 'https://example.com/test-user-battery.jpg',
        createdBy: testUser.id
      }
    ]);

    // Create test discounts
    await Discount.bulkCreate([
      {
        code: 'SOLAR20',
        type: 'percentage',
        value: 20,
        isActive: true,
        description: 'Solar panel discount'
      },
      {
        code: 'BATTERY10',
        type: 'percentage', 
        value: 10,
        isActive: true,
        description: 'Battery discount'
      }
    ]);

    console.log('Test data seeded successfully');
    return {
      testUser,
      adminUser,
      products,
      categories: [solarCategory, batteryCategory]
    };
  } catch (error) {
    console.error('Database setup failed:', error);
    throw error;
  }
}

export async function cleanupTestDatabase() {
  try {
    await sequelize.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Database cleanup failed:', error);
  }
}
