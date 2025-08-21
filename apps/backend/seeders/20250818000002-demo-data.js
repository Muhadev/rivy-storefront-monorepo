// 20250818000002-demo-data.js
"use strict";

const imageUrls = [
  "https://cdn11.bigcommerce.com/s-x3ki4mm/images/stencil/1500x1500/products/4365/5749/Solar_Panel_2__49082.1608565658.jpg?c=2&imbypass=on",
  "https://cdn11.bigcommerce.com/s-x3ki4mm/images/stencil/1500x1500/products/3179/4305/SOLAR_PANEL_250WATTS_24V_POLY__67786.1585685949.jpg?c=2&imbypass=on",
  "https://pwrth.mahasib.com/laswndwnh/porta/mwh_anz/PIOdua0bqg.png"
];

const categories = [
  { name: "Solar Panels", description: "High efficiency solar panels for all needs." },
  { name: "Inverters", description: "Reliable inverters for energy conversion." },
  { name: "Batteries", description: "Long-lasting batteries for energy storage." },
  { name: "Accessories", description: "Essential accessories for solar setups." }
];

function getRandomImage() {
  return imageUrls[Math.floor(Math.random() * imageUrls.length)];
}

function getRandomCategoryId() {
  return Math.floor(Math.random() * 4) + 1;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    // Upsert categories
    for (const cat of categories) {
      await queryInterface.sequelize.query(`
        INSERT INTO categories (name, description, "createdAt", "updatedAt")
        VALUES ('${cat.name}', '${cat.description}', NOW(), NOW())
        ON CONFLICT (name) DO UPDATE SET
          description = EXCLUDED.description,
          "updatedAt" = NOW();
      `);
    }

    // Get category IDs by name
    const [catRows] = await queryInterface.sequelize.query('SELECT id, name FROM categories;');
    const catMap = Object.fromEntries(catRows.map(row => [row.name, row.id]));

    // Seed products
    const catNames = Object.keys(catMap);
    const products = [];
    for (let i = 1; i <= 55; i++) {
      // Assign products to categories in round-robin fashion
      const catName = catNames[i % catNames.length];
      products.push({
        name: `Demo Product ${i}`,
        description: `Description for Demo Product ${i}`,
        price: (100 + Math.random() * 900).toFixed(2),
        stock: Math.floor(Math.random() * 100) + 1,
        categoryId: catMap[catName],
        imageUrl: getRandomImage(),
        createdBy: 1, // Use adminId 1 for demo
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    await queryInterface.bulkInsert("products", products, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("products", null, {});
    await queryInterface.bulkDelete("categories", null, {});
  }
};
