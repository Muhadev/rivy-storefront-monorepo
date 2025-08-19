import { Sequelize } from 'sequelize';

// Validate DATABASE_URL environment variable
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is required');
  console.log('💡 Please set DATABASE_URL in your environment variables');
  console.log('📝 Format: postgresql://username:password@host:port/database');
  process.exit(1);
}

console.log('🔗 Connecting to database...');

export const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development',
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false
    } : false
  }
});

export async function connectDb() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully');
    
    // Prefer migrations by default. Enable sync explicitly with DB_SYNC=true
    if (process.env.DB_SYNC === 'true') {
      await sequelize.sync();
      console.log('Database models synchronized (DB_SYNC enabled)');
    } else {
      console.log('ℹ Using migrations for schema management (DB_SYNC disabled)');
    }
  } catch (error) {
    console.error('Unable to connect to database:', error);
    throw error;
  }
}
