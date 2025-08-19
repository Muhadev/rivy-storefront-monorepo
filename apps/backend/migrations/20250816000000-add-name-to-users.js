'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('users').catch(() => null);
    if (table && !table.name) {
      await queryInterface.addColumn('users', 'name', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'User' // Temporary for existing records
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'name');
  }
};