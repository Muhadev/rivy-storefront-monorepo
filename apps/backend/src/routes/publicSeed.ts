// import { Router } from 'express';
// @ts-ignore
import demoUserSeeder from '../../seeders/20250816000001-demo-data.js';
// @ts-ignore
import demoProductSeeder from '../../seeders/20250818000002-demo-data.js';

const express = require("express");
const { sequelize } = require("./models");
const path = require("path");

const router = express.Router();

// Change POST to GET for assessment/review purposes
router.get('/seed-db', async (req: import('express').Request, res: import('express').Response) => {
  try {
    await sequelize.sync({ force: true });
    await demoUserSeeder.up(sequelize.getQueryInterface(), sequelize);
    await demoProductSeeder.up(sequelize.getQueryInterface(), sequelize);
    res.json({ message: 'Database reset and seeders executed successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to reset and seed database.' });
  }
});

export default router;