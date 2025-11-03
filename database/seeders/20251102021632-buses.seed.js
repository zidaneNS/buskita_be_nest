'use strict';

const { v4: uuid } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.bulkInsert('buses', [
    {
      busId: uuid(),
      name: '12',
      totalRow: 6,
      totalCol: 5,
      totalBackseat: 6
    },
    {
      busId: uuid(),
      name: '08',
      totalRow: 4,
      totalCol: 5,
      totalBackseat: 6
    },
   ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('buses', null, {});
  }
};
