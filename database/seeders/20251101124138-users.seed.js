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
      phoneNumber: '0812345',
      address: 'indonesia',
      roleId: 1,
      status: 'approve',
    },
    {
      userId: '181221081',
      name: 'laurenza',
      email: 'laurenza@example.com',
      password: await bcrypt.hash('password', 10),
      phoneNumber: '081234567',
      address: 'indonesia',
      roleId: 2,
      status: 'approve',
    },
   ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
