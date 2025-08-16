import { Sequelize } from 'sequelize';

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://rivy:rivy@localhost:5432/rivy';

export const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  logging: false
});

export async function connectDb() {
  await sequelize.authenticate();
  await sequelize.sync();
}
