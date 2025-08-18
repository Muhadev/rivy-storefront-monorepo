require('dotenv').config({ 
  path: require('path').resolve(__dirname, '../../.env') 
});

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
