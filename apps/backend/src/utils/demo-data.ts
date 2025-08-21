import { QueryInterface, Sequelize } from 'sequelize';
import * as bcrypt from 'bcryptjs';

const imageUrls = [
  "https://cdn11.bigcommerce.com/s-x3ki4mm/images/stencil/1500x1500/products/4365/5749/Solar_Panel_2__49082.1608565658.jpg?c=2&imbypass=on",
  "https://cdn11.bigcommerce.com/s-x3ki4mm/images/stencil/1500x1500/products/3179/4305/SOLAR_PANEL_250WATTS_24V_POLY__67786.1585685949.jpg?c=2&imbypass=on",
  "https://pwrth.mahasib.com/laswndwnh/porta/mwh_anz/PIOdua0bqg.png"
];

interface User {
  name: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'customer';
  createdAt: Date;
  updatedAt: Date;
}

interface Category {
  name: string;
  description: string;
}

export const users: User[] = [
  {
    name: 'Alice Admin',
    email: 'alice.admin@example.com',
    passwordHash: bcrypt.hashSync('adminpass123', 10),
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Bob Customer',
    email: 'bob.customer@example.com',
    passwordHash: bcrypt.hashSync('customerpass456', 10),
    role: 'customer',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const categories: Category[] = [
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
  imageUrl: string;
  createdBy?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface CategoryRow {
  id: number;
  name: string;
}

  
  // Insert Premium Products
  export const premiumProducts: Omit<Product, 'createdBy'>[] = [
    // Solar Panels
    {
      name: 'Premium Solar Panel 250W',
      description: 'High-efficiency monocrystalline solar panel with 25-year warranty',
      price: 299.99,
      stock: 50,
    // Assuming 'Solar Panels' is categoryId 1
      imageUrl: getRandomImage(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Premium Solar Panel 400W',
      description: 'Ultra-high efficiency panel perfect for residential installations',
      price: 449.99,
      stock: 30,
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
      imageUrl: getRandomImage(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Digital Solar Monitor',
      description: 'Real-time monitoring system for solar energy production',
      price: 129.99,
      stock: 15,
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
      imageUrl: getRandomImage(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Deep Cycle Battery 200Ah',
      description: 'Heavy-duty AGM battery for off-grid applications',
      price: 349.99,
      stock: 12,
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
      imageUrl: getRandomImage(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Grid-Tie Inverter 3000W',
      description: 'Professional-grade inverter for grid-connected systems',
      price: 899.99,
      stock: 8,
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
      imageUrl: getRandomImage(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'MC4 Connector Set',
      description: 'Waterproof connectors for solar panel connections',
      price: 19.99,
      stock: 100,
      imageUrl: getRandomImage(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  

// Export for Sequelize CLI compatibility (if needed)
module.exports = {
  categories,
  premiumProducts,
  users,
};