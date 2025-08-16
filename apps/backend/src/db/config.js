// Replace entire file content:
module.exports = {
  development: {
    username: process.env.DB_USER || 'rivy',
    password: process.env.DB_PASSWORD || 'rivy',
    database: process.env.DB_NAME || 'rivy',
    host: process.env.DB_HOST || 'db',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false
  },
  test: {
    username: process.env.DB_USER || 'rivy',
    password: process.env.DB_PASSWORD || 'rivy',
    database: process.env.DB_NAME || 'rivy_test',
    host: process.env.DB_HOST || 'db',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false
  },
  production: {
    username: process.env.DB_USER || 'rivy',
    password: process.env.DB_PASSWORD || 'rivy',
    database: process.env.DB_NAME || 'rivy',
    host: process.env.DB_HOST || 'db',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false
  }
};require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

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
