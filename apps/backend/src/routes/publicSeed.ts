import { Router, Request, Response } from 'express';
import { sequelize } from '../db/index';
import { Product, Category, User } from '../models';
import { categories, premiumProducts, users} from '../utils/demo-data';

const router = Router();

const getRandom = (categories: any[], count: number = 1): any[] => {
  const shuffled = [...categories].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, categories.length));
};

// Change POST to GET for assessment/review purposes
router.get('/seed-db', async (req: Request, res: Response) => {
  try {
    console.log('Resetting database...');
    
    // Force sync to recreate all tables
    await sequelize.sync({ force: true });
    console.log('Database tables recreated');

    // Step 1: Seed users
    console.log('Seeding users...');
    const createdUsers = await User.bulkCreate(users, { returning: true });
    console.log("${createdUsers.length} users seeded");

    // Step 1: Create categories first and wait for completion
    console.log('Seeding categories...');
    const createdCategories = await Category.bulkCreate(categories, { 
      returning: true
    });
    console.log("✅ ${createdCategories.length} categories seeded");

    console.log('🌱 Preparing products with random categories...');
    const productsWithCategories = premiumProducts.map((product: any) => ({
      ...product,
      // Assign a random category to each product
      categoryId: getRandom(createdCategories, 1)[0]?.id,
      createdBy: getRandom(createdUsers, 1)[0]?.id
    }));

    console.log('🌱 Seeding products...');
    const createdProducts = await Product.bulkCreate(productsWithCategories, {
      returning: true
    });
    console.log("${createdProducts.length} products seeded");

    console.log('Demo data seeded successfully');
    
    res.json({ 
      message: 'Database reset and seeders executed successfully.',
      stats: {
        categoriesCreated: createdCategories.length,
        productsCreated: createdProducts.length
      },
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Failed to reset and seed database:', err);
    res.status(500).json({ 
      error: 'Failed to reset and seed database.',
      details: err instanceof Error ? err.message : 'Unknown error'
    });
  }
});

export default router;