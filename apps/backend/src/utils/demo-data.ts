import { QueryInterface, Sequelize } from 'sequelize';
import * as bcrypt from 'bcryptjs';

const imageUrls = [
  "https://cdn11.bigcommerce.com/s-x3ki4mm/images/stencil/1500x1500/products/4365/5749/Solar_Panel_2__49082.1608565658.jpg?c=2&imbypass=on",
  "https://cdn11.bigcommerce.com/s-x3ki4mm/images/stencil/1500x1500/products/3179/4305/SOLAR_PANEL_250WATTS_24V_POLY__67786.1585685949.jpg?c=2&imbypass=on",
  "https://pwrth.mahasib.com/laswndwnh/porta/mwh_anz/PIOdua0bqg.png"
];

interface Category {
  name: string;
  description: string;
}

const categories: Category[] = [
  { name: 'Solar Panels', description: 'High-efficiency solar panels for renewable energy' },
  { name: 'Electronics', description: 'Electronic devices and accessories' },
  { name: 'Batteries', description: 'Energy storage solutions and battery packs' },
  { name: 'Inverters', description: 'Power inverters and converters' },
  { name: 'Accessories', description: 'Solar system accessories and components' }
];

function getRandomImage(): string {
  return imageUrls[Math.floor(Math.random() * imageUrls.length)];
}

interface Product {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  imageUrl: string;
  createdBy?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface CategoryRow {
  id: number;
  name: string;
}

export const seedDemoData = async (queryInterface: QueryInterface, sequelize: Sequelize) => {
  // Hash passwords for demo users
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const userPasswordHash = await bcrypt.hash('user123', 10);

  // Upsert Users (insert or update if exists)
  await queryInterface.sequelize.query(`
    INSERT INTO users (email, "passwordHash", name, role, "createdAt", "updatedAt")
    VALUES
      ('admin@rivy.com', '${adminPasswordHash}', 'Admin User', 'admin', NOW(), NOW()),
      ('user@rivy.com', '${userPasswordHash}', 'Regular User', 'customer', NOW(), NOW())
    ON CONFLICT (email) DO UPDATE SET
      "passwordHash" = EXCLUDED."passwordHash",
      name = EXCLUDED.name,
      role = EXCLUDED.role,
      "updatedAt" = NOW();
  `);

  // Upsert Categories
  for (const cat of categories) {
    await queryInterface.sequelize.query(`
      INSERT INTO categories (name, description, "createdAt", "updatedAt")
      VALUES ('${cat.name}', '${cat.description}', NOW(), NOW())
      ON CONFLICT (name) DO UPDATE SET
        description = EXCLUDED.description,
        "updatedAt" = NOW();
    `);
  }

  // Get category IDs by name
  const [catRows] = await queryInterface.sequelize.query('SELECT id, name FROM categories;') as [CategoryRow[], unknown];
  const catMap = Object.fromEntries(catRows.map(row => [row.name, row.id]));

  // Insert Premium Products
  const premiumProducts: Omit<Product, 'createdBy'>[] = [
    // Solar Panels
    {
      name: 'Premium Solar Panel 250W',
      description: 'High-efficiency monocrystalline solar panel with 25-year warranty',
      price: 299.99,
      stock: 50,
      categoryId: catMap['Solar Panels'],
      imageUrl: getRandomImage(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Premium Solar Panel 400W',
      description: 'Ultra-high efficiency panel perfect for residential installations',
      price: 449.99,
      stock: 30,
      categoryId: catMap['Solar Panels'],
      imageUrl: getRandomImage(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    
    // Electronics
    {
      name: 'Solar Charge Controller MPPT 40A',
      description: 'Maximum Power Point Tracking charge controller for optimal efficiency',
      price: 89.99,
      stock: 25,
      categoryId: catMap['Electronics'],
      imageUrl: getRandomImage(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Digital Solar Monitor',
      description: 'Real-time monitoring system for solar energy production',
      price: 129.99,
      stock: 15,
      categoryId: catMap['Electronics'],
      imageUrl: getRandomImage(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    
    // Batteries
    {
      name: 'Lithium Battery Pack 100Ah',
      description: 'Long-lasting lithium iron phosphate battery for energy storage',
      price: 599.99,
      stock: 20,
      categoryId: catMap['Batteries'],
      imageUrl: getRandomImage(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Deep Cycle Battery 200Ah',
      description: 'Heavy-duty AGM battery for off-grid applications',
      price: 349.99,
      stock: 12,
      categoryId: catMap['Batteries'],
      imageUrl: getRandomImage(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    
    // Inverters
    {
      name: 'Pure Sine Wave Inverter 1500W',
      description: 'Clean power inverter for sensitive electronics',
      price: 249.99,
      stock: 18,
      categoryId: catMap['Inverters'],
      imageUrl: getRandomImage(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Grid-Tie Inverter 3000W',
      description: 'Professional-grade inverter for grid-connected systems',
      price: 899.99,
      stock: 8,
      categoryId: catMap['Inverters'],
      imageUrl: getRandomImage(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    
    // Accessories
    {
      name: 'Solar Panel Mounting Kit',
      description: 'Complete mounting solution for roof installations',
      price: 79.99,
      stock: 35,
      categoryId: catMap['Accessories'],
      imageUrl: getRandomImage(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'MC4 Connector Set',
      description: 'Waterproof connectors for solar panel connections',
      price: 19.99,
      stock: 100,
      categoryId: catMap['Accessories'],
      imageUrl: getRandomImage(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  await queryInterface.bulkInsert('products', premiumProducts, {});

  // Generate additional demo products
  const catNames = Object.keys(catMap);
  const demoProducts: Product[] = [];
  
  for (let i = 1; i <= 45; i++) { // 45 more products + 10 premium = 55 total
    const catName = catNames[i % catNames.length];
    demoProducts.push({
      name: `Demo Product ${i}`,
      description: `Description for Demo Product ${i}`,
      price: parseFloat((100 + Math.random() * 900).toFixed(2)),
      stock: Math.floor(Math.random() * 100) + 1,
      categoryId: catMap[catName],
      imageUrl: getRandomImage(),
      createdBy: 1, // Use adminId 1 for demo
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  await queryInterface.bulkInsert('products', demoProducts, {});

  // Insert Sample Discounts
  await queryInterface.sequelize.query(`
    INSERT INTO discounts (code, description, type, value, "minOrderAmount", "maxUses", "usedCount", "startDate", "endDate", "isActive", "createdAt", "updatedAt") VALUES
      ('WELCOME10', '10% off for new customers', 'percentage', 10.00, 100.00, 100, 0, NOW(), NOW() + interval '30 days', true, NOW(), NOW()),
      ('SOLAR50', '$50 off solar panel purchases over $500', 'fixed', 50.00, 500.00, 50, 0, NOW(), NOW() + interval '60 days', true, NOW(), NOW())
    ON CONFLICT (code) DO UPDATE SET
      description = EXCLUDED.description,
      type = EXCLUDED.type,
      value = EXCLUDED.value,
      "minOrderAmount" = EXCLUDED."minOrderAmount",
      "maxUses" = EXCLUDED."maxUses",
      "usedCount" = EXCLUDED."usedCount",
      "startDate" = EXCLUDED."startDate",
      "endDate" = EXCLUDED."endDate",
      "isActive" = EXCLUDED."isActive",
      "updatedAt" = NOW();
  `);
};

export const removeDemoData = async (queryInterface: QueryInterface) => {
  // Remove data in reverse order to handle foreign key constraints
  await queryInterface.bulkDelete('discounts', {}, {});
  await queryInterface.bulkDelete('products', {}, {});
  await queryInterface.bulkDelete('categories', {}, {});
  await queryInterface.bulkDelete('users', {}, {});
};

// Export for Sequelize CLI compatibility (if needed)
module.exports = {
  async up(queryInterface: QueryInterface, sequelize: Sequelize) {
    return seedDemoData(queryInterface, sequelize);
  },

  async down(queryInterface: QueryInterface) {
    return removeDemoData(queryInterface);
  }
};