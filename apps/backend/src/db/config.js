require('dotenv').config({ 
  path: require('path').resolve(__dirname, '../../.env.production.local') 
});

module.exports = {
  development: {
    username: process.env.DB_USER || 'rivy',
    password: process.env.DB_PASSWORD || 'rivy',
    database: process.env.DB_NAME || 'rivy',
    host: process.env.DB_HOST || 'db',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: console.log, // Enable logging in development
    define: {
      underscored: false, // Use camelCase
      timestamps: true
    }
  },
  test: {
    username: process.env.DB_USER || 'rivy',
    password: process.env.DB_PASSWORD || 'rivy',
    database: process.env.DB_NAME || 'rivy_test',
    host: process.env.DB_HOST || 'db',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false, // Disable logging in tests
    define: {
      underscored: false,
      timestamps: true
    }
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false, // Disable logging in production for performance
    define: {
      underscored: false,
      timestamps: true
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
};

module.exports = {
  development: {
    username: process.env.POSTGRES_USER || 'rivy',
    password: process.env.POSTGRES_PASSWORD || 'rivy',
    database: process.env.POSTGRES_DB || 'rivy',
    host: process.env.DB_HOST || 'db',
    dialect: 'postgres',
    port: process.env.DB_PORT || 5432
  },
  test: {
    username: 'rivy',
    password: 'rivy',
    database: 'rivy_test',
    host: '127.0.0.1',
    dialect: 'postgres',
    port: 5432
  },
  production: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT || 5432
  }
};
