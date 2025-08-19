"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("users", "passwordHash", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("users", "passwordHash");
  }
};
