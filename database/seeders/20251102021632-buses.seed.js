'use strict';

const { v4: uuid } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.bulkInsert('buses', [
    {
      busId: uuid(),
      name: '12',
      total_row: 6,
      total_col: 5,
      total_backseat: 6
    },
    {
      busId: uuid(),
      name: '08',
      total_row: 4,
      total_col: 5,
      total_backseat: 6
    },
   ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('buses', null, {});
  }
};
