import { Router, Request, Response } from 'express';
import { sequelize } from '../db/index';
import { seedDemoData, removeDemoData } from '../utils/demo-data';

// const { sequelize } = require('../models');

// const router = Router();
const router = Router();

// Change POST to GET for assessment/review purposes
router.get('/seed-db', async (req: Request, res: Response) => {
  try {
    console.log('🔄 Resetting database...');
    
    // Force sync to recreate all tables
    await sequelize.sync({ force: true });
    console.log('✅ Database tables recreated');
    
    // Run the seeder
    console.log('🌱 Seeding demo data...');
    await seedDemoData(sequelize.getQueryInterface(), sequelize);
    console.log('✅ Demo data seeded successfully');
    
    res.json({ 
      message: 'Database reset and seeders executed successfully.',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('❌ Failed to reset and seed database:', err);
    res.status(500).json({ 
      error: 'Failed to reset and seed database.',
      details: err instanceof Error ? err.message : 'Unknown error'
    });
  }
});
export default router;