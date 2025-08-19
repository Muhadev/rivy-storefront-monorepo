"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Only rename if source column exists and target does not
    const table = await queryInterface.describeTable('orders').catch(() => null);
    if (!table) return;
    const hasSource = Object.prototype.hasOwnProperty.call(table, 'shippingAddress');
    const hasTarget = Object.prototype.hasOwnProperty.call(table, 'address');
    if (hasSource && !hasTarget) {
      await queryInterface.renameColumn('orders', 'shippingAddress', 'address');
    }
  },

  async down(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('orders').catch(() => null);
    if (!table) return;
    const hasSource = Object.prototype.hasOwnProperty.call(table, 'address');
    const hasTarget = Object.prototype.hasOwnProperty.call(table, 'shippingAddress');
    if (hasSource && !hasTarget) {
      await queryInterface.renameColumn('orders', 'address', 'shippingAddress');
    }
  }
};


