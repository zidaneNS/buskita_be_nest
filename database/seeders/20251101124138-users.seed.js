'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.bulkInsert('users', [
    {
      userId: '181221055',
      name: 'zidane',
      email: 'zidane@example.com',
      password: await bcrypt.hash('password', 10),
      phone_number: '0812345',
      address: 'indonesia',
      roleId: 1
    }
   ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
