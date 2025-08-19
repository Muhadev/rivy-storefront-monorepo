'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if 'unitPrice' column already exists before adding
    const table = await queryInterface.describeTable('order_items');
    if (!table.unitPrice) {
      await queryInterface.addColumn('order_items', 'unitPrice', {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      });
    }

    // If you want to migrate data from 'price' to 'unitPrice' if 'price' exists
    if (table.price) {
      await queryInterface.sequelize.query('UPDATE order_items SET "unitPrice" = price');
      // Optionally remove the old 'price' column
      await queryInterface.removeColumn('order_items', 'price');
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Remove 'unitPrice' column
    await queryInterface.removeColumn('order_items', 'unitPrice');
    // Optionally add back 'price' column if you removed it above
    // await queryInterface.addColumn('order_items', 'price', {
    //   type: Sequelize.DECIMAL(10, 2),
    //   allowNull: false,
    //   defaultValue: 0
    // });
  }
};