'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.bulkInsert('roles', [
    {
      roleId: 1,
      name: 'superadmin'
    },
    {
      roleId: 2,
      name: 'admin'
    },
    {
      roleId: 3,
      name: 'user'
    }
   ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {})
  }
};
