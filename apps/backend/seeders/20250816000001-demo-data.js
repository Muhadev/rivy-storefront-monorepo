'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
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

    // Insert Categories
    await queryInterface.bulkInsert('categories', [
      {
        name: 'Solar Panels',
        description: 'High-efficiency solar panels for renewable energy',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Electronics',
        description: 'Electronic devices and accessories',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Batteries',
        description: 'Energy storage solutions and battery packs',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Inverters',
        description: 'Power inverters and converters',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Accessories',
        description: 'Solar system accessories and components',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

    // Insert Products (referencing category IDs)
    await queryInterface.bulkInsert('products', [
      // Solar Panels (categoryId: 1)
      {
        name: 'Premium Solar Panel 250W',
        description: 'High-efficiency monocrystalline solar panel with 25-year warranty',
        price: 299.99,
        stock: 50,
        categoryId: 1,
        imageUrl: 'https://example.com/solar-panel-250w.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Premium Solar Panel 400W',
        description: 'Ultra-high efficiency panel perfect for residential installations',
        price: 449.99,
        stock: 30,
        categoryId: 1,
        imageUrl: 'https://example.com/solar-panel-400w.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      // Electronics (categoryId: 2)
      {
        name: 'Solar Charge Controller MPPT 40A',
        description: 'Maximum Power Point Tracking charge controller for optimal efficiency',
        price: 89.99,
        stock: 25,
        categoryId: 2,
        imageUrl: 'https://example.com/charge-controller-40a.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Digital Solar Monitor',
        description: 'Real-time monitoring system for solar energy production',
        price: 129.99,
        stock: 15,
        categoryId: 2,
        imageUrl: 'https://example.com/solar-monitor.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      // Batteries (categoryId: 3)
      {
        name: 'Lithium Battery Pack 100Ah',
        description: 'Long-lasting lithium iron phosphate battery for energy storage',
        price: 599.99,
        stock: 20,
        categoryId: 3,
        imageUrl: 'https://example.com/lithium-battery-100ah.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Deep Cycle Battery 200Ah',
        description: 'Heavy-duty AGM battery for off-grid applications',
        price: 349.99,
        stock: 12,
        categoryId: 3,
        imageUrl: 'https://example.com/deep-cycle-200ah.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      // Inverters (categoryId: 4)
      {
        name: 'Pure Sine Wave Inverter 1500W',
        description: 'Clean power inverter for sensitive electronics',
        price: 249.99,
        stock: 18,
        categoryId: 4,
        imageUrl: 'https://example.com/inverter-1500w.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Grid-Tie Inverter 3000W',
        description: 'Professional-grade inverter for grid-connected systems',
        price: 899.99,
        stock: 8,
        categoryId: 4,
        imageUrl: 'https://example.com/grid-tie-3000w.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      // Accessories (categoryId: 5)
      {
        name: 'Solar Panel Mounting Kit',
        description: 'Complete mounting solution for roof installations',
        price: 79.99,
        stock: 35,
        categoryId: 5,
        imageUrl: 'https://example.com/mounting-kit.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'MC4 Connector Set',
        description: 'Waterproof connectors for solar panel connections',
        price: 19.99,
        stock: 100,
        categoryId: 5,
        imageUrl: 'https://example.com/mc4-connectors.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

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
  },

  async down(queryInterface, Sequelize) {
    // Remove data in reverse order to handle foreign key constraints
    await queryInterface.bulkDelete('discounts', null, {});
    await queryInterface.bulkDelete('products', null, {});
    await queryInterface.bulkDelete('categories', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};
